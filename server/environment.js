import fs from 'fs'
import dotenv from 'dotenv'
import path from 'path';

/**
 * load correct environnemnt depending on process.env.NODE_ENV
 */
const loadEnv = envPath => {
  return new Promise((resolve, reject) => {
    if (!envPath) {
      reject("env path must be defined");
    }
    try {
      // eslint-disable-next-line no-sync
      fs.statSync(envPath);
      const env = dotenv.load({
        path: envPath
      });

      const envStr = JSON.stringify(env);
      resolve(envStr);
    } catch (e) {
      reject(e);
    }
  });
};

const configureEnv = config => {
  return new Promise((resolve, reject) => {
    const HAS_ENV = (
      typeof process !== 'undefined' &&
      process.env
    );

    if (!HAS_ENV) {
      reject('process or process.env is/are not defined');
    }

    const HAS_CONFIG = (
      typeof config !== 'undefined' &&
      (config.devEnv || config.prodEnv || config.testEnv)
    );

    if (!HAS_CONFIG) {
      reject('usage: configureEnv({ devEnv: [name], prodEnv: [name], testEnv: [name]})');
    }

    let envPath = config.prodEnv;

    const IS_PROD = (
      process.env.NODE_ENV === 'production'
    );

    const IS_TEST = (
      process.env.NODE_ENV === 'test'
    );

    if (!IS_PROD && !IS_TEST) {
      process.env.NODE_ENV = 'development';
      envPath = config.devEnv;
    }

    envPath = path.join(__dirname, envPath);

    loadEnv(envPath)
    .then(env => resolve(env))
    .catch(err => reject('Could not load environment:\n' + err));
  });
}

export default configureEnv;
