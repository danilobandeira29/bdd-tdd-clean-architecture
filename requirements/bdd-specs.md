# BDD-specs

### Narrativa 1
```
Como um cliente online, quero que o sistema me mostre minhas compras para eu poder controlar minhas despesas
```

### Cenários
```
Se o cliente tem conexão com a internet, quando cliente solicitar para carregar suas compras, então o sistema deve exibir suas compras vindo de uma API e substituir os dados do cache com os dados mais atuais
```

### Narrativa 2
```
Como cliente offline, quero que o sistema me mostre minhas últimas compras gravadas para eu poder ver minhas desespesas mesmo estando offline
```

### Cenários
```
Dado que o cliente não tem conexão com a internet 
  e exista algum dado gravado em cache
  e os dados do cache forem mais novos que 3 dias
Quando o cliente solicitar para carregar suas compras, então o sistema deve exibir suas compras vindas do cache

Dado que o cliente não tem conexão com a internet
  e exista algum dado gravado no cache
  e os dados forem mais velhos ou iguais aos de 3 dias atrás
Quando o cliente solicitar para recarregar suas compras
Então o sistema deve exibir uma mensagem de erro

Dado que o cliente não tem conexão com a internet
 e o cache está vazio
Quando o cliente solicitar para carregar suas compras
então o sistema deve exibir uma mensagem de erro
```
