# Neon Runner Mega — reconstrução modular

Base independente de reconstrução. A versão oficial V6 e os arquivos antigos permanecem intactos.

## Executar
Sirva esta pasta por um servidor estático e abra `index.html`. Os módulos ES não funcionam corretamente via `file://`.

## Testes
Com Node.js, execute `npm test` dentro desta pasta.

## Mecânicas atuais
- Três pistas, contagem regressiva e corrida.
- Controles por teclado e gestos de toque (swipe).
- Pulo e deslize para evitar dois tipos de obstáculo.
- Moedas em fileiras e escudo que absorve uma colisão.
- Progressão automática de nível e aumento gradual de velocidade.
- Recorde, carteira de moedas e pontuação salvos localmente no dispositivo.
- Tela de resultado com distância, pontuação e moedas coletadas.

## Organização
- `js/core/`: estado e loop.
- `js/entities/`: movimento do jogador.
- `js/systems/`: entrada, pista, colisões, colecionáveis e progresso.
- `tests/`: regressões automatizadas.

O progresso é salvo no armazenamento local do navegador. Limpar os dados do site pode apagar esses registros.

## Próximas etapas
Validar no Node e em navegador móvel; depois migrar personagens, loja, missões, mapas, habilidades e identidade visual da versão de referência. Esta reconstrução ainda não substitui o jogo completo.
