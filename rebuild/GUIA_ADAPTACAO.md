# Guia de adaptação — Neon Runner

Este projeto usa o guia de endless runner enviado pelo usuário como referência de sistemas, mas o resultado deve continuar sendo **Neon Runner Mega Edition**.

## Referência que manda
- `../NeonRunner_PLAY.html`: base funcional original V5 Ascension.
- `../V6.html`: versão oficial preservada na branch `main`.
- `rebuild/`: reconstrução modular experimental; não substitui a versão oficial.

## Aparência e sensação que devem ser preservadas
- Renderização 2D Canvas com perspectiva pseudo-3D.
- Projeção original `P(l,r,h)`, onde pista, profundidade e altura mudam a posição e escala na tela.
- Pista em profundidade, prédios laterais, postes, luzes, biomas e clima.
- Personagem desenhado e animado no Canvas (referência `dc(...)`), não um retângulo.
- Lobby animado com trem, personagem central, HUD de moedas/chaves/fragmentos/recorde, missões, evento e menus.
- Obstáculos, moedas e power-ups desenhados com escala e posição derivadas da perspectiva.

## Como aplicar o guia recebido
| Sistema do guia | Adaptação ao Neon Runner |
|---|---|
| 3 pistas, swipe, pulo e rolagem | Preservar os controles e integrar ao estado modular |
| Câmera e perspectiva | Recriar a projeção pseudo-3D original em Canvas; não trocar por pista plana |
| Obstáculos e trilhos | Migrar tipos originais e adicionar padrões seguros |
| Power-ups | Preservar os power-ups e habilidades já definidos no original |
| Personagens e skins | Usar elenco original do Neon Runner |
| Lobby | Recriar o lobby original animado e seus painéis |
| Loja/economia | Preservar moedas, chaves, fragmentos, compras e saves originais |
| Missões/progressão | Migrar missões diárias/semanais, passe, níveis e conquistas |
| Ranking/social | Manter ranking local e stubs já existentes |
| Áudio/VFX/configurações | Migrar sem bloquear a jogabilidade em dispositivos móveis |

## Ordem correta de reconstrução
1. Renderer de mundo e pista com perspectiva original.
2. Personagem animado, obstáculos, moedas e power-ups na perspectiva correta.
3. Lobby e navegação original.
4. Migrar sistemas de corrida e controles com testes de regressão.
5. Migrar personagens, loja, economia, missões, passe, modos e saves.
6. Polimento, áudio, efeitos e otimização mobile.
7. Comparar lado a lado com a referência antes de qualquer publicação.

## Regras de preservação
- Não remover recursos originais para simplificar a reconstrução.
- Não trocar o elenco por personagens de Subway Surfers nem copiar seus assets.
- Não substituir o visual pseudo-3D por uma estrada retangular plana.
- Não alterar a V6 oficial em `main`.
- Não declarar uma etapa pronta sem executar testes e validar no navegador.
