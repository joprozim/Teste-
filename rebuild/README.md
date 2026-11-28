# Neon Runner Mega — reconstrução modular

Esta pasta contém a primeira base modular independente. Ela não substitui a versão publicada nem altera V6/V7.

## Executar
Abra `index.html` por um servidor estático (por exemplo, GitHub Pages apontando para esta pasta ou um servidor local). Os módulos ES não devem ser testados abrindo o arquivo diretamente via `file://`.

## Testes
Com Node.js instalado, dentro desta pasta execute `npm test`.

## Módulos
- `js/core/state.js`: estado e transições.
- `js/core/loop.js`: atualização e delta de tempo.
- `js/entities/player.js`: movimento e pulo.
- `js/systems/input.js`: teclado e toque.
- `js/systems/track.js`: pista, obstáculos e fileiras de moedas.
- `js/systems/collectibles.js`: coleta de moedas e atualização do contador.
- `js/systems/collision.js`: colisões.
- `js/main.js`: renderização e ligação da interface.

Esta é a fundação jogável mínima; os sistemas e a identidade visual da base antiga serão migrados em etapas, após validar o núcleo.