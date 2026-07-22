<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUX — Sensualidade & Sofisticação</title>
</head>
<body>

  <!-- Importa Cabeçalho + Rodapé em Módulo -->
  <script type="module">
    import { inserirCabecalho } from './cabecalho-componente.js';
    import { inserirRodape } from './rodape-componente.js';
    
    inserirCabecalho();
    inserirRodape();
  </script>

  <!-- Seu conteúdo principal fica AQUI -->
  <main style="padding: 2rem; min-height: calc(100vh - 200px);">
    <h2>Bem-vindo à LUX</h2>
    <p>Conteúdo da página...</p>
  </main>

</body>
</html>
