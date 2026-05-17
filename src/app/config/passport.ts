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
import { envVars } from "./env.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email, isDeleted: false })
          .select("+password")
          .lean();

        if (!user) {
          return done(null, false, {
            message: "User not found with the provided email",
          });
        }

        const hasGoogleAuth = user.auths.some(
          (auth) => auth.provider === "google",
        );

        if (hasGoogleAuth && !user.password) {
          return done(null, false, {
            message:
              "This account uses Google OAuth for authentication. If you want to log in with email and password, please set up a password for your account.",
          });
        }

        const isPasswordMatched = await bcrypt.compare(
          password,
          user.password as string,
        );

        if (!isPasswordMatched) {
          return done(null, false, {
            message: "Invalid credentials",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false, {
          message: "Error occurred while processing local authentication",
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
            message: "No email found in Google profile",
          });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
          const newUser = await UserModel.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value as string,
            role: UserRole.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });

          return done(null, newUser, {
            message: "New user created via Google OAuth",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, false, {
          message: "Error occurred while processing Google OAuth",
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
