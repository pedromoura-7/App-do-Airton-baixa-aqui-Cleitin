TuKans Detail — Protótipo de Agendamento de Estética Automotiva

1. Ideia e Objetivo

O TuKans Detail é um protótipo de aplicativo móvel desenvolvido em React Native, voltado para o agendamento de serviços de estética automotiva. A ideia central é proporcionar ao cliente uma forma simples e intuitiva de reservar serviços como lavagem, higienização, polimento e vitrificação, escolhendo data e horário disponíveis, informando os dados do veículo e selecionando adicionais que complementam o serviço contratado.

O objetivo do protótipo é validar a experiência completa do cliente, desde o login até a confirmação do agendamento, incluindo cálculo automático de preço, prevenção de conflitos de horário e visualização dos agendamentos realizados. Tudo isso é feito de forma local, sem integração com banco de dados ou servidor, apenas para demonstrar o fluxo real da aplicação.

2. Funcionalidades Implementadas

O protótipo conta com uma tela inicial de Splash animada, que apresenta o logotipo da marca com um efeito de pulsação. Há também um sistema de login simulado, em que o usuário válido é o e-mail cliente@tukans.com com senha 123456. Após o login, o cliente tem acesso ao catálogo completo de serviços, cada um contendo nome, tipo, preço base, duração estimada, descrição e um emoji ilustrativo.

A navegação pelos serviços pode ser filtrada por categoria, como Lavagem, Higienização, Polimento ou Proteção, além da opção de exibir todos. Cada serviço pode ser agendado através de um modal específico, onde o usuário insere modelo e placa do veículo, seleciona o porte (Pequeno, Médio ou Grande, influenciando no preço final), escolhe a data no calendário e o horário desejado dentro da faixa de funcionamento, e pode ainda adicionar serviços complementares, como oxi-sanitização ou hidratação de plásticos.

O sistema gera automaticamente os horários disponíveis entre 09:00 e 17:00, desconsiderando o horário de almoço das 12:00. A checagem de conflitos garante que dois agendamentos não se sobreponham. O valor total é calculado em tempo real considerando o preço base, o fator de porte do veículo e os adicionais. Após a confirmação, o agendamento é salvo em memória e pode ser visualizado na seção “Meus Agendamentos”, que também permite cancelamentos.

3. Funcionalidades a serem Implementadas

Ainda que o protótipo seja funcional, há diversas funcionalidades planejadas para evoluir o projeto. Uma delas é a persistência local dos agendamentos utilizando AsyncStorage ou um banco SQLite, evitando a perda de dados ao fechar o aplicativo. Também se prevê a criação de um backend real em Node.js ou outro framework, que permita autenticação segura, gestão centralizada de disponibilidade, múltiplos funcionários, cadastro dinâmico de serviços e relatórios administrativos.

Outro ponto futuro é a implementação de pagamentos via PIX ou cartão de crédito, com emissão de comprovantes. Funcionalidades como reagendamento, edição e regras de cancelamento também estão previstas, além de notificações push ou via WhatsApp/SMS. Melhorias na usabilidade incluem a validação avançada de campos, máscaras para placas, suporte a internacionalização de idiomas e moedas, além de acessibilidade ampliada. Por fim, a aplicação também deve evoluir para contar com testes unitários, automação de deploy (CI/CD) e integração com ferramentas de monitoramento como Sentry ou Firebase Analytics.

4. Stack de Tecnologias

O projeto foi desenvolvido utilizando React Native, com hooks do React (useState, useEffect, useRef) e os principais componentes nativos como FlatList, Modal, Animated e StatusBar. Para seleção de datas, foi utilizada a biblioteca @react-native-community/datetimepicker. Além disso, a API Animated foi aplicada para criar efeitos na tela de Splash, e o módulo Platform para ajustes de comportamento entre iOS e Android.

Os recursos visuais incluem imagens armazenadas localmente na pasta de assets, como o logotipo da empresa e o ícone de carrinho. Para rodar, é necessário Node.js com npm ou yarn, podendo ser executado tanto em Expo quanto em React Native CLI.

5. Como Executar o Ambiente de Desenvolvimento (Opcional)

O protótipo não possui backend e todo o estado é controlado em memória. Dessa forma, a execução pode ser feita de maneira simples utilizando Expo ou React Native CLI.

No caso do Expo, basta instalar a CLI globalmente, rodar o comando de instalação das dependências do projeto e executar npx expo start. O aplicativo poderá ser aberto diretamente no emulador ou em um dispositivo físico pelo app Expo Go. Para a CLI do React Native, é necessário rodar npm install ou yarn, realizar a instalação dos pods no iOS e iniciar com npx react-native run-ios ou npx react-native run-android.

É importante garantir que os arquivos de imagem estejam na pasta correta, em ./assets/imagens/tukans.png e ./assets/imagens/carrinho.png. O login é feito exclusivamente com o usuário cliente@tukans.com e senha 123456. Os horários disponíveis vão de 09:00 a 17:00, exceto 12:00, e qualquer tentativa de agendar em horário já ocupado é bloqueada. O cálculo do preço é feito dinamicamente, combinando preço base, porte do veículo e adicionais. Como não há persistência, todos os agendamentos são perdidos ao encerrar o aplicativo.