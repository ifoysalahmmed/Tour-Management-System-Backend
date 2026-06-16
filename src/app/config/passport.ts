import bcrypt from "bcryptjs";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import { UserRole } from "../modules/user/user.interface.js";
import { UserModel } from "../modules/user/user.model.js";
import { assertUserStatus } from "../utils/assertUserStatus.js";
import { envVars } from "./env.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({
          email,
          isDeleted: false,
        })
          .select("+password")
          .lean();

        if (!user) {
          return done(null, false, {
            message: "No active user account found with this email address",
          });
        }

        assertUserStatus(user);

        const hasGoogleAuth = user.auths.some(
          (auth) => auth.provider === "google",
        );

        if (hasGoogleAuth && !user.password) {
          return done(null, false, {
            message:
              "This account is registered with Google sign-in. Please use Google login or set a password before using email login.",
          });
        }

        const isPasswordMatched = await bcrypt.compare(
          password,
          user.password as string,
        );

        if (!isPasswordMatched) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false, {
          message: "Local authentication failed. Please try again later.",
        });
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(null, false, {
            message: "Google account did not provide an email address",
          });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
          const newUser = await UserModel.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value as string,
            role: UserRole.User,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });

          return done(null, newUser, {
            message: "User account created successfully with Google sign-in",
          });
        }

        assertUserStatus(user);

        return done(null, user);
      } catch (error) {
        return done(error, false, {
          message: "Google authentication failed. Please try again later.",
        });
      }
    },
  ),
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(
  async (
    id: unknown,
    done: (err: any, user?: false | Express.User | null | undefined) => void,
  ) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);
