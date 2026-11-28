# Neon Runner V6 Evolution

Esta versão fica isolada na branch `v6-expansion`. A branch `main` e os arquivos da V5 não foram alterados.

## Melhorias incluídas
- Painel de estatísticas de carreira: corridas, distância, moedas, pulos, manobras, tempo e melhor pontuação.
- Dez conquistas com barras de progresso.
- Acesso aos painéis pelo lobby.
- Backup local do progresso e restauração manual.
- Importação de save com validação básica e cópia de segurança automática antes de substituir o save atual.
- Foco de teclado visível e respeito à preferência de movimento reduzido do sistema.
- `index.html` desta branch abre a V6 diretamente.

## Compatibilidade
- Mantém a chave de armazenamento original do jogo e adiciona apenas o objeto `v6Stats`.
- As conquistas são informativas e não alteram física, colisões, velocidade, moedas ou dificuldade.
- O backup fica no mesmo navegador/dispositivo; para transferir progresso entre dispositivos, use Exportar/Importar Save.

## Testes pendentes
A versão foi atualizada no GitHub, mas ainda precisa de teste manual em navegador desktop e celular. Não foi publicada na branch principal.
