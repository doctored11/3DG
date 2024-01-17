export const indexTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reddit</title>

  <script src ="/socket.io/socket.io.js"></script>
  
</head>

<body>
  <div id="react_root">${content}</div>
  <canvas id="game-zone"></canvas>
  <script src="/static/client.js" type="application/javascript"></script>
</body>

</html>
`;
