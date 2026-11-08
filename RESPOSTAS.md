
# RESPOSTAS · Checkpoint 3

Uma entrada por transição. Em cada uma, explico a ação usada, o que muda no stack e o que acontece ao apertar o botão voltar. O contador "telas no stack", na tela de Detalhe, mostra quantas telas estão no stack e ajuda a conferir.

1. **Login → Cadastro:** `navigate('Register')`. O Cadastro abre por cima do Login, que continua no stack (Login, Cadastro). Ao voltar, o Cadastro é removido e o Login aparece do jeito que estava. Isso permite que o usuário desista do cadastro e volte para entrar na conta.

2. **Cadastro → Home (no OK do Alert):** `popToTop()` e depois `replace('Home')`. Primeiro, o `popToTop` remove o Cadastro e deixa apenas o Login. Depois, o `replace` substitui o Login pela Home. Assim, o stack fica só com a Home, e pressionar o botão voltar (no android) fecha o aplicativo, já que não faz sentido retornar ao cadastro ou ao login depois de criar a conta.

3. **Login → Home:** `replace('Home')`. O Login é removido e substituído pela Home (stack: Home). Como não existe nenhuma tela anterior no stack, pressionar o botão voltar (no android) não retorna ao Login e acaba fechando o aplicativo.

4. **Home → Lista:** `navigate('List')`, na opção "Ver músicas" do álbum. A Lista abre por cima da Home, que continua no stack (Home, Lista). Ao voltar, a Lista é removida e a Home aparece como estava antes.

5. **Lista → Detalhe:** `navigate('Detail', { music })`. O Detalhe abre por cima da Lista e recebe a música selecionada como parâmetro. Esse parâmetro é acessado por `route.params.music` e já tem o tipo `Music`, definido no `RootStackParamList` (stack: Home, Lista, Detalhe). Ao voltar, o Detalhe é removido e a Lista aparece na mesma posição da rolagem.

6. **Detalhe → PRÓXIMA MÚSICA:** `push('Detail', { music: nextMusic(music) })`. Um novo Detalhe é aberto por cima do atual, mesmo sendo a mesma rota (stack: Home, Lista, Detalhe, Detalhe). Se fosse usado `navigate`, a música seria apenas trocada na tela atual, sem criar uma nova tela, e a anterior seria perdida. Com `push`, cada música fica em uma tela separada, permitindo voltar para a música anterior.

7. **Detalhe → VOLTAR:** `goBack()`, no botão VOLTAR do player. Essa ação remove a tela atual e diminui o stack em uma tela. Se o usuário tiver usado PRÓXIMA MÚSICA, ele volta para a música anterior. Se estiver no primeiro Detalhe, retorna para a Lista. Funciona da mesma forma que a seta do cabeçalho e o botão voltar do Android.

8. **Detalhe → INÍCIO:** `popToTop()`, no botão da casa. Essa ação remove todas as telas acima da primeira de uma só vez, independentemente de quantas músicas foram abertas. Como o Login e o Cadastro já foram removidos com `replace`, a primeira tela é a Home (stack: Home). A partir dela, pressionar o botão voltar (no android) fecha o aplicativo.

9. **Home → SAIR:** `clearSession()` e depois `replace('Login')`, no painel do usuário. Primeiro, a sessão é apagada do AsyncStorage. Em seguida, o `replace` remove a Home e coloca o Login no lugar (stack: Login). Como a Home não está mais no stack, pressionar o botão voltar (no android) não consegue retornar para ela e acaba fechando o aplicativo.
