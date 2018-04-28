export default function(assets, browserEnv, state, rendered) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Wabba luba dup dup</title>
        <link rel="stylesheet" type="text/css" href="/public/fonts/font-awesome.min.css">
        ${
            assets
            .filter(path => path.endsWith('.css'))
            .map(path => `<link rel="stylesheet" href="${path}" />`)
        }

      </head>
      <body>

        <div id="root">${rendered}</div>

        <script type="text/javascript">
          window.process = ${JSON.stringify(browserEnv)}
          window.REDUX_INITIAL_STATE = ${JSON.stringify(state)}
        </script>

        ${
            assets
            .filter(path => path.endsWith('.js'))
            .map(path => `<script src="${path}"></script>`)
        }

      </body>
    </html>
  `
}
