import passport from "passport";
import {
  Strategy as GoogleStrategy,
  type Profile,
  type VerifyCallback,
} from "passport-google-oauth20";

import { envVars } from "./env.js";
import { UserModel } from "../modules/user/user.model.js";
import { UserRole } from "../modules/user/user.interface.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
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
