# Neon Runner Mega V7 — branch de testes

**Não publicada na main.** Teste pela branch `v7-mega-update`.

## Novidades
- Passe de carreira gratuito com seis marcos por distância acumulada (0, 1k, 5k, 15k, 30k e 60k metros).
- Resgates únicos guardados no save; moedas e fragmentos como recompensas.
- Personagem Aurora, desbloqueado ao atingir 60.000 m e resgatar o último marco. Visual cosmético, sem vantagem de gameplay.
- Compatível com save antigo: campos novos criados quando usados

## Testes pendentes
- Jogar e verificar tab Passe, resgates e persistência após recarregar
- Verificar desbloqueio Aurora em save de teste com distância suficiente
- Testar loja e personagens existentes
- Nenhum teste de navegador foi executado por este commit


## V7.1 — estabilidade (em teste)
- Protege a leitura do modificador de clima contra valores inválidos no save.
- Mantém o loop de animação ativo se ocorrer uma exceção durante atualização ou desenho; pausa a partida e registra o erro no console para diagnóstico.
- Ainda precisa de teste real no Safari/iPhone e em desktop. Esta branch não altera a versão oficial.
