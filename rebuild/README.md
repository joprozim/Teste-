# Neon Runner Mega — reconstrução modular

Base independente de reconstrução. A versão oficial V6 e os arquivos antigos permanecem intactos.

## Executar
Sirva esta pasta por um servidor estático e abra `index.html`. Os módulos ES não funcionam corretamente via `file://`.

## Testes
Com Node.js, execute `npm test` dentro desta pasta.

## Mecânicas atuais
- Três pistas e corrida com contagem regressiva.
- Movimento por teclado e gestos de toque (swipe).
- Pulo para evitar barreiras.
- Deslize para passar por obstáculos baixos.
- Moedas coletáveis em fileiras.
- Power-up de escudo que absorve uma colisão.
- HUD com distância, moedas e estado do escudo.

## Organização
- `js/core/`: estado e loop.
- `js/entities/`: movimento do jogador.
- `js/systems/`: entrada, pista, colisões e colecionáveis.
- `tests/`: regressões automatizadas.

## Próxima etapa
Validar no Node e em navegador móvel; depois migrar progressão, personagens, loja, missões, mapas e identidade visual da versão de referência. Esta reconstrução ainda não substitui o jogo completo.
