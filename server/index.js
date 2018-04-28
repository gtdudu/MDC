import colors from 'colors/safe';
import configureEnv from './environment';

const envConfig = {
  devEnv: '../.env_dev',
  prodEnv: '../.env_prod',
  testEnv: '../.env_test',
}

configureEnv(envConfig)
  .then(loadedEnv => {
    if (process.env.NODE_ENV === 'production') {
      console.log(colors.yellow('launching app in production mode with env:'));
      console.log(colors.yellow(loadedEnv));
      require('./server-prod');
      return;
    }

    if (process.env.NODE_ENV === 'development') {
     console.log(colors.yellow('launching app in development mode with env:'));
      console.log(colors.yellow(loadedEnv));
      require('./server-dev');
    }
  })
  .catch(err => console.log(colors.red(err)))
;
