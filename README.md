variavel de ambiente
mvp
premissas
cron
get e post


MONGO
- alunos
- mentores
- datas / mentoresId
- apostas


testar conexão banco
testar front / back
criar GET /datas
	=> datas / mentores / minimo
criar GET /alunos
	=> alunos / saldo

front aluno | dia | mentor | aposta

criar POST /aposta {data, alunoId, mentorId, aposta}
	=> [dia, aluno, mentor, aposta]

front tabela listagem

task [calcular vencedor]


PROBLEMAS
apostas duplicadas
- debounce
- pq não calcula junto