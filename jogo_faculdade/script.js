document.addEventListener('DOMContentLoaded', () => {
    const scoreDisplay = document.getElementById('score-display');
    const scenarioTextElement = document.getElementById('scenario-text');
    const optionsContainer = document.getElementById('options-container');
    const outcomeTextElement = document.getElementById('outcome-text');
    const nextButton = document.getElementById('next-button');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreElement = document.getElementById('final-score');
    const finalTitleElement = document.getElementById('final-title');
    const restartButton = document.getElementById('restart-button');
    const gameContainer = document.getElementById('game-container');

    let currentScore = 100;
    let currentScenarioIndex = 0;

    const scenariosTemplate = [
        {
            scenario: "CENÁRIO 1: O E-MAIL SUSPEITO\n\nUm funcionário do financeiro reporta um e-mail urgente do 'CEO', pedindo a transferência imediata de R$ 50.000 para um 'novo fornecedor'. O e-mail parece legítimo, mas o CEO está de férias.",
            options: [
                { 
                    text: "Instruir o funcionário a IGNORAR e DELETAR o e-mail imediatamente. (Engenharia Social)",
                    points: 10,
                    outcome: "RESULTADO: Boa decisão! Era um golpe de 'Spear Phishing'. Você evitou uma fraude e usou isso como um caso de treinamento. A equipe está mais alerta."
                },
                { 
                    text: "Ligar para o celular pessoal do CEO para confirmar a transferência.",
                    points: -15, 
                    outcome: "RESULTADO: Falha! O celular do CEO foi clonado (SIM Swap). O golpista 'confirmou' a urgência. A transferência foi feita. A empresa perdeu R$ 50.000."
                }
            ]
        },
        {
            scenario: "CENÁRIO 2: VULNERABILIDADE 'ZERO-DAY'\n\nSeu sistema de monitoramento (IDS) detecta uma varredura agressiva na Porta 8080. Minutos depois, um boletim de segurança global alerta sobre uma nova vulnerabilidade 'Zero-Day' no seu software de servidor web.",
            options: [
                { 
                    text: "Aplicar um 'patch virtual' no WAF (Firewall de Aplicação Web) para bloquear o padrão de ataque e isolar os servidores críticos.",
                    points: 15,
                    outcome: "RESULTADO: Excelente! O WAF bloqueou as tentativas de exploração. Você ganhou tempo para que o fornecedor libere o patch oficial sem tirar o sistema do ar."
                },
                { 
                    text: "Desligar o servidor web principal para 'conter' o ataque até segunda-feira.",
                    points: -20,
                    outcome: "RESULTADO: Desastre! Desligar o serviço causou pânico nos clientes e parou as vendas (Perda de Disponibilidade). Enquanto isso, o atacante usou a mesma falha em um servidor secundário que você esqueceu."
                }
            ]
        },
        {
            scenario: "CENÁRIO 3: O PENDRIVE ACHADO\n\nUm funcionário da limpeza encontra um pendrive no estacionamento com o rótulo 'Salários 2025' e o entrega para o RH. O RH o conecta em um computador da rede interna para 'verificar do que se trata'.",
            options: [
                { 
                    text: "Correr para o RH, desconectar fisicamente a máquina da rede e iniciar o protocolo de resposta a incidentes (Malware/Ransomware).",
                    points: 10,
                    outcome: "RESULTADO: Ação rápida! O pendrive continha um Ransomware. Você isolou a máquina antes que ela pudesse criptografar os arquivos do servidor. A máquina foi formatada."
                },
                { 
                    text: "Pedir ao RH para rodar o antivírus da máquina no pendrive.",
                    points: -25,
                    outcome: "RESULTADO: Violação Grave! O malware usou uma técnica que enganou o antivírus. Em segundos, ele se espalhou pela rede, criptografando o servidor de arquivos. A empresa parou."
                }
            ]
        },
        {
            scenario: "CENÁRIO 4: O ACESSO DO DEV\n\nUm desenvolvedor novo pede acesso 'root' (Administrador) ao servidor de banco de dados em produção para 'debugar um problema urgente do cliente'.",
            options: [
                { 
                    text: "Negar o acesso 'root'. Criar um usuário temporário para ele com permissões de 'somente leitura' (read-only) no banco de dados específico que ele precisa ver.",
                    points: 10,
                    outcome: "RESULTADO: Perfeito! Você aplicou o 'Princípio do Menor Privilégio'. O dev resolveu o problema e o risco de um comando errado (como 'DROP TABLE') ou vazamento de credenciais foi nulo."
                },
                { 
                    text: "Conceder o acesso. O problema é urgente e ele parece saber o que está fazendo.",
                    points: -20,
                    outcome: "RESULTADO: Risco desnecessário! O dev, sem querer, rodou um script de teste no banco de produção, corrompendo dados de 500 clientes. O backup levará horas para restaurar."
                }
            ]
        },
        {
            scenario: "CENÁRIO 5: A SENHA NA NOTA ADESIVA\n\nVocê está andando pelo escritório e vê que o Gerente de Projetos tem uma nota adesiva (Post-it) em seu monitor com a senha do Wi-Fi corporativo (WPA2-Enterprise) e sua senha de rede.",
            options: [
                { 
                    text: "Abordar o gerente privadamente, explicar o risco (Política de Mesa Limpa) e solicitar que ele mude a senha de rede imediatamente.",
                    points: 5,
                    outcome: "RESULTADO: Bom trabalho. Conscientização é chave! O gerente entendeu o risco. Você aproveitou para enviar um lembrete geral sobre a política de senhas."
                },
                { 
                    text: "Tirar uma foto e enviar para o RH, pedindo uma punição formal.",
                    points: -10,
                    outcome: "RESULTADO: Ação ineficaz. Você criou um conflito interno e não resolveu o problema de segurança imediato (a senha que continua exposta). A cultura de segurança piorou."
                }
            ]
        }
    ];

    let scenarios = JSON.parse(JSON.stringify(scenariosTemplate));

    function startGame() {
        currentScore = 100;
        currentScenarioIndex = 0;
 
        scenarios = JSON.parse(JSON.stringify(scenariosTemplate));
        gameContainer.classList.remove('hidden');
        gameOverScreen.classList.add('hidden');
        updateScore();
        loadScenario();
    }

    function updateScore() {
        scoreDisplay.textContent = `PONTUAÇÃO DE SEGURANÇA: ${currentScore}`;
    }


    function typeWriter(text, element, callback) {
        let i = 0;
        element.innerHTML = "";
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, 30);
            } else if (callback) {
                callback(); 
            }
        }
        type();
    }

    function loadScenario() {
        const scenario = scenarios[currentScenarioIndex];
        
        scenario.options.sort(() => Math.random() - 0.5);
        
        optionsContainer.innerHTML = '';
        outcomeTextElement.innerHTML = '';
        outcomeTextElement.className = '';
        nextButton.classList.add('hidden');

        typeWriter(scenario.scenario, scenarioTextElement, () => {
            scenario.options.forEach((option, index) => {
                const button = document.createElement('button');
                
                const prefix = (index === 0) ? "A) " : "B) ";
                
                button.innerText = prefix + option.text; // Coloca o prefixo no texto
                
                button.addEventListener('click', () => selectOption(option));
                optionsContainer.appendChild(button);
            });
        });
    }

    function selectOption(option) {
        currentScore += option.points;
        updateScore();

        outcomeTextElement.innerHTML = option.outcome;
        if (option.points > 0) {
            outcomeTextElement.classList.add('good-outcome');
        } else {
            outcomeTextElement.classList.add('bad-outcome');
        }

        optionsContainer.innerHTML = ''; // Limpa os botões
        nextButton.classList.remove('hidden');

        if (currentScenarioIndex === scenarios.length - 1) {
            nextButton.innerText = "Ver Resultado Final >_";
        }
    }

    function handleNext() {
        currentScenarioIndex++;
        if (currentScenarioIndex < scenarios.length) {
            loadScenario();
        } else {
            endGame();
        }
    }

    function endGame() {
        gameContainer.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');

        finalScoreElement.textContent = `PONTUAÇÃO FINAL: ${currentScore}`;

        let title = '';
        if (currentScore >= 100) {
            title = "GURU DA SEGURANÇA (SS+)";
            finalTitleElement.style.color = "#00ff41";
        } else if (currentScore >= 70) {
            title = "ANALISTA CONFIÁVEL (A)";
            finalTitleElement.style.color = "#ffffff";
        } else if (currentScore >= 40) {
            title = "ANALISTA EM TREINAMENTO (C)";
            finalTitleElement.style.color = "#ffff00";
        } else {
            title = "RISCO CORPORATIVO (F)";
            finalTitleElement.style.color = "#ff4141";
        }
        finalTitleElement.textContent = title;
    }

    nextButton.addEventListener('click', handleNext);
    restartButton.addEventListener('click', startGame);

    startGame();
});