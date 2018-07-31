# Let's go to Spring Break!

Você e seus amigos decidiram realizar uma viagem para conhecerem o Spring Break Cancun em 2019. Para que este sonho se torne realidade, cada um deve conseguir R$ 10.000,00 para pagar o custo de sua viagem. Como são amigos a muito tempo, vocês decidiram guardar o dinheiro juntos e emprestar para um bancário que lhes dará uma taxa de juros de 1% ao dia.
Como você é a única pessoa que conhece programação entre seus amigos, você decidiu criar uma API em JavaScript que auxilie na gestão e acompanhamento desse objetivo.

## Regras de negócio:

• A data limite para conseguirem o dinheiro é 01/03/2019 (DD/MM/AAAA);
• A taxa de juros acontece sobre cada operação e é recebido pelos amigos exatamente às 00:00 de cada dia. Você deve considerar juros sobre juros (dica: os valores dos juros não precisam ser armazenados, eles podem ser calculados em tempo de execução);
• Não deve ser possível adicionar uma receita para uma data futura;

### A seguinte lista de APIs devem estar disponíveis:

1. Pessoa: Uma API para gerenciar seus amigos que irão participar da viagem. O
esquema base desta API é exibido abaixo:
{
“id”: “3858bd85-b2dc-4fbf-a271-d04b4b2e8a2e”, “name”: “Emma Thomas” }

#### A descrição das APIs é exibida a seguir:

a. Cadastrar pessoa: Você deseja salvar apenas o nome dos seus amigos. A API deve gerar um UUID versão 4 como ID para cada registro que for cadastrado. O tamanho máximo do nome deve ser 80 carácteres; 

b. Editar pessoa: Você deseja editar apenas o nome dos seus amigos;

c. Consultar pessoa: Você deseja visualizar o nome e o ID gerado dos seus
amigos; 

d. Deletar pessoa: Você deseja deletar seus amigos por ID. Ao deletar um
amigo, todas as suas receitas também devem ser deletadas. 

2. Receita: Uma API para gerenciar o dinheiro que você e seus amigos conseguirem
ao longo do tempo. O esquema base desta API é exibido abaixo:

{
“id”: “5e04a855-71e1-4650-8cdb-252d0a160af3”, “code”: “5E04A855”, “date”: “20/04/2018”, “value”: 250.50, “note”: “Dinheiro que minha mãe me deu...”, “person”: {
“id”: “3858bd85-b2dc-4fbf-a271-d04b4b2e8a2e” } }

#A descrição das APIs é exibida a seguir:

a. Cadastrar receita: Você quer que o ID e o código sejam gerados pela API. O código consiste dos oito primeiros carácteres do ID e todas as letras devem ser maiúsculas. O campo de data deve respeitar a máscara DD/MM/AAAA. O campo de valor deve ser um número positivo de até duas casas decimais. O campo de observação deve suportar até 255 caracteres e não é obrigatório. O campo de pessoa deve conter o ID da pessoa que está fazendo o depósito; 

b. Editar receita: Você deseja editar qualquer informação da receita, exceto o
ID e o código; 

c. Consultar receita: Você deseja visualizar todas as informações das
receitas, incluindo o nome do seu amigo que fez o depósito; 

d. Deletar receita: Você deseja apagar uma receita. 

3. How much do we have: Esta API deve calcular, considerando os valores dos juros (e do juros sobre juros), o valor total arrecadado naquele momento. O valor deve ser exibido no formato Brasileiro de moeda (por exemplo, R$ 5.436,67). 

4. Are we going to Spring Break: Esta API deve calcular, baseado no valor que vocês têm até o momento e os juros que que serão ganhos até a data da viagem, se a viagem irá acontecer ou não. Esta API deve retornar um valor booleano true caso a viagem é possível ou false se a viagem não for possível.
As tecnologias que podem ser utilizadas para a resolução deste problema são o Node JS e o Express para a criação das APIs.
