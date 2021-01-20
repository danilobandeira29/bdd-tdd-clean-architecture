## Carregar compras do cache
### Caso de sucesso
1. Sistema executa o comando 'Carregar compras'
2. Sistema carrega os dados do cache
3. Sistema válida o cache se tem menos que 3 dias
4. Sistema cria uma lista de compras à partir dos dados do cache
5. Sistema retorna a lista de compras

### Exceção - Cache expirado
1. Sistema limpa o cache
2. Sistema retorna um erro

### Exceção - Cache vázio
1. Sistema retorna um erro
