 // Variables del juego
        let score = 0;
        let correctCount = 0;
        let attempts = 0;
        let currentEquation = {};
        let progress = 0;
        let isCustomEquation = false;
        let factorizationCorrect = false;
        let currentMode = 'factorization'; // 'factorization', 'roots', 'custom'
        
        // Elementos del DOM
        const equationElement = document.getElementById('equation');
        const customEquationInputs = document.getElementById('customEquationInputs');
        const factorInputs = document.getElementById('factorInputs');
        const rootsInputs = document.getElementById('rootsInputs');
        const sign1Select = document.getElementById('sign1');
        const sign2Select = document.getElementById('sign2');
        const factor1Input = document.getElementById('factor1');
        const factor2Input = document.getElementById('factor2');
        const root1Input = document.getElementById('root1');
        const root2Input = document.getElementById('root2');
        const root1Equation = document.getElementById('root1Equation');
        const root2Equation = document.getElementById('root2Equation');
        const feedbackElement = document.getElementById('feedback');
        const discriminantInfo = document.getElementById('discriminantInfo');
        const checkBtn = document.getElementById('checkBtn');
        const hintBtn = document.getElementById('hintBtn');
        const nextBtn = document.getElementById('nextBtn');
        const customBtn = document.getElementById('customBtn');
        const scoreElement = document.getElementById('score');
        const correctCountElement = document.getElementById('correctCount');
        const attemptsElement = document.getElementById('attempts');
        const progressElement = document.getElementById('progress');
        const currentYearElement = document.getElementById('current-year');
        
        // Elementos para ecuación personalizada
        const customASign = document.getElementById('customA-sign');
        const customA = document.getElementById('customA');
        const customBSign = document.getElementById('customB-sign');
        const customB = document.getElementById('customB');
        const customCSign = document.getElementById('customC-sign');
        const customC = document.getElementById('customC');
        
        // Actualizar año actual en el crédito
        currentYearElement.textContent = new Date().getFullYear();
        
        // Generar una ecuación cuadrática factorizable
        function generateEquation() {
            // Generar factores aleatorios (números entre 1 y 10)
            let factor1 = Math.floor(Math.random() * 10) + 1;
            let factor2 = Math.floor(Math.random() * 10) + 1;
            
            // Decidir aleatoriamente los signos
            const sign1 = Math.random() > 0.5 ? '+' : '-';
            const sign2 = Math.random() > 0.5 ? '+' : '-';
            
            // Calcular coeficientes a, b, c
            const a = 1;
            let b, c;
            
            if (sign1 === '+' && sign2 === '+') {
                b = factor1 + factor2;
                c = factor1 * factor2;
            } else if (sign1 === '+' && sign2 === '-') {
                b = factor1 - factor2;
                c = -factor1 * factor2;
            } else if (sign1 === '-' && sign2 === '+') {
                b = factor2 - factor1;
                c = -factor1 * factor2;
            } else { // sign1 === '-' && sign2 === '-'
                b = -(factor1 + factor2);
                c = factor1 * factor2;
            }
            
            // Guardar la ecuación actual
            currentEquation = {
                factor1: factor1,
                factor2: factor2,
                sign1: sign1,
                sign2: sign2,
                a: a,
                b: b,
                c: c,
                root1: sign1 === '+' ? -factor1 : factor1,
                root2: sign2 === '+' ? -factor2 : factor2
            };
            
            // Mostrar la ecuación
            displayEquation(a, b, c);
            
            // Limpiar inputs y feedback
            resetInputs();
            
            // Enfocar el primer input
            factor1Input.focus();
        }
        
        // Mostrar ecuación en formato legible
        function displayEquation(a, b, c) {
            let equationString = '';
            
            // Coeficiente a
            if (a !== 1) {
                equationString += `${a}`;
            }
            equationString += 'x²';
            
            // Coeficiente b
            if (b > 0) {
                equationString += ` + ${b}x`;
            } else if (b < 0) {
                equationString += ` - ${Math.abs(b)}x`;
            }
            
            // Coeficiente c
            if (c > 0) {
                equationString += ` + ${c}`;
            } else if (c < 0) {
                equationString += ` - ${Math.abs(c)}`;
            }
            
            equationString += ' = 0';
            equationElement.textContent = equationString;
        }
        
        // Resetear inputs y feedback
        function resetInputs() {
            sign1Select.value = '+';
            sign2Select.value = '+';
            factor1Input.value = '';
            factor2Input.value = '';
            root1Input.value = '';
            root2Input.value = '';
            feedbackElement.textContent = '';
            feedbackElement.className = 'feedback';
            discriminantInfo.classList.add('hidden');
            rootsInputs.classList.add('hidden');
            factorizationCorrect = false;
            currentMode = 'factorization';
            updateButtonStates();
        }
        
        // Actualizar estados de los botones según el modo actual
        function updateButtonStates() {
            switch(currentMode) {
                case 'custom':
                    checkBtn.textContent = 'Verificar Ecuación';
                    customBtn.textContent = 'Usar Ecuación Aleatoria';
                    customEquationInputs.classList.remove('hidden');
                    factorInputs.classList.add('hidden');
                    rootsInputs.classList.add('hidden');
                    break;
                    
                case 'factorization':
                    checkBtn.textContent = 'Verificar';
                    customBtn.textContent = 'Ingresar Ecuación';
                    customEquationInputs.classList.add('hidden');
                    factorInputs.classList.remove('hidden');
                    rootsInputs.classList.add('hidden');
                    break;
                    
                case 'roots':
                    checkBtn.textContent = 'Verificar Raíces';
                    customBtn.textContent = 'Ingresar Ecuación';
                    customEquationInputs.classList.add('hidden');
                    factorInputs.classList.add('hidden');
                    rootsInputs.classList.remove('hidden');
                    break;
            }
        }
        
        // Verificar la factorización
        function checkFactorization() {
            const userSign1 = sign1Select.value;
            const userSign2 = sign2Select.value;
            const userFactor1 = parseInt(factor1Input.value);
            const userFactor2 = parseInt(factor2Input.value);
            
            if (isNaN(userFactor1) || isNaN(userFactor2) || userFactor1 < 1 || userFactor2 < 1) {
                feedbackElement.textContent = 'Por favor, ingresa números válidos (mayores a 0)';
                feedbackElement.className = 'feedback incorrect';
                return;
            }
            
            attempts++;
            attemptsElement.textContent = attempts;
            
            // Verificar si la respuesta es correcta (considerando el orden)
            if ((userSign1 === currentEquation.sign1 && userSign2 === currentEquation.sign2 && 
                 userFactor1 === currentEquation.factor1 && userFactor2 === currentEquation.factor2) ||
                (userSign1 === currentEquation.sign2 && userSign2 === currentEquation.sign1 && 
                 userFactor1 === currentEquation.factor2 && userFactor2 === currentEquation.factor1)) {
                
                feedbackElement.textContent = '¡Correcto! La factorización es correcta. Ahora encuentra las raíces.';
                feedbackElement.className = 'feedback correct';
                
                score += 10;
                correctCount++;
                factorizationCorrect = true;
                currentMode = 'roots';
                
                scoreElement.textContent = score;
                correctCountElement.textContent = correctCount;
                
                // Actualizar ecuaciones de raíces
                const factor1 = userSign1 === currentEquation.sign1 ? userFactor1 : userFactor2;
                const factor2 = userSign2 === currentEquation.sign2 ? userFactor2 : userFactor1;
                const sign1 = userSign1 === currentEquation.sign1 ? userSign1 : userSign2;
                const sign2 = userSign2 === currentEquation.sign2 ? userSign2 : userSign1;
                
                root1Equation.textContent = `x ${sign1} ${factor1} = 0`;
                root2Equation.textContent = `x ${sign2} ${factor2} = 0`;
                
                // Actualizar estados de botones
                updateButtonStates();
                
                // Actualizar progreso
                progress = Math.min(progress + 5, 100);
                progressElement.style.width = progress + '%';
                
            } else {
                feedbackElement.textContent = 'Incorrecto. Intenta nuevamente.';
                feedbackElement.className = 'feedback incorrect';
                
                // Reducir puntuación por intentos incorrectos
                score = Math.max(0, score - 2);
                scoreElement.textContent = score;
            }
        }
        
        // Verificar las raíces
        function checkRoots() {
            const userRoot1 = parseFloat(root1Input.value);
            const userRoot2 = parseFloat(root2Input.value);
            
            if (isNaN(userRoot1) || isNaN(userRoot2)) {
                feedbackElement.textContent = 'Por favor, ingresa ambas raíces';
                feedbackElement.className = 'feedback incorrect';
                return;
            }
            
            // Verificar si las raíces son correctas (considerando el orden)
            if ((Math.abs(userRoot1 - currentEquation.root1) < 0.001 && Math.abs(userRoot2 - currentEquation.root2) < 0.001) ||
                (Math.abs(userRoot1 - currentEquation.root2) < 0.001 && Math.abs(userRoot2 - currentEquation.root1) < 0.001)) {
                
                feedbackElement.textContent = '¡Excelente! Has encontrado correctamente las raíces de la ecuación.';
                feedbackElement.className = 'feedback correct';
                
                score += 10;
                correctCount++;
                
                scoreElement.textContent = score;
                correctCountElement.textContent = correctCount;
                
                // Cambiar función del botón a siguiente
                checkBtn.textContent = 'Siguiente';
                checkBtn.onclick = nextEquation;
                
                // Actualizar progreso
                progress = Math.min(progress + 5, 100);
                progressElement.style.width = progress + '%';
                
            } else {
                feedbackElement.textContent = 'Raíces incorrectas. Intenta nuevamente.';
                feedbackElement.className = 'feedback incorrect';
                
                // Reducir puntuación por intentos incorrectos
                score = Math.max(0, score - 2);
                scoreElement.textContent = score;
            }
        }
        
        // Proporcionar una pista
  function giveHint() {
    if (currentMode === 'factorization') {
        // Dar una pista sobre los factores con signos correctos
        const cValue = currentEquation.c;
        const bValue = currentEquation.b;
        
        const cSign = cValue < 0 ? '-' : '';
        const bSign = bValue < 0 ? '-' : '';
        
        const cAbsolute = Math.abs(cValue);
        const bAbsolute = Math.abs(bValue);
        
        const hint = `Pista: Los factores deben multiplicarse para dar ${cSign}${cAbsolute} y sumarse para dar ${bSign}${bAbsolute}`;
        feedbackElement.textContent = hint;
        feedbackElement.className = 'feedback';
    } else if (currentMode === 'roots') {
        // Dar una pista sobre las raíces
        const hint = `Pista: Resuelve cada factor igualado a cero. Por ejemplo, si tienes (x + a) = 0, entonces x = -a`;
        feedbackElement.textContent = hint;
        feedbackElement.className = 'feedback';
    }
}
        
        // Verificar si una ecuación cuadrática es factorizable
        function isFactorizable(a, b, c) {
            // Calcular el discriminante
            const discriminant = b * b - 4 * a * c;
            
            // Información detallada del discriminante
            let discriminantInfoText = `<strong>Cálculo del discriminante:</strong><br>`;
            discriminantInfoText += `D = b² - 4ac = (${b})² - 4(${a})(${c}) = ${b*b} - ${4*a*c} = ${discriminant}<br>`;
            
            // Si el discriminante es negativo
            if (discriminant < 0) {
                discriminantInfoText += `El discriminante es negativo (${discriminant} < 0), por lo que la ecuación no tiene soluciones reales.`;
                return { 
                    factorizable: false, 
                    reason: "El discriminante es negativo, por lo que la ecuación no tiene soluciones reales.",
                    discriminantInfo: discriminantInfoText
                };
            }
            
            // Verificar si es cuadrado perfecto
            const sqrtDiscriminant = Math.sqrt(discriminant);
            if (sqrtDiscriminant !== Math.floor(sqrtDiscriminant)) {
                discriminantInfoText += `El discriminante (${discriminant}) no es un cuadrado perfecto, por lo que la ecuación no se puede factorizar con números enteros.`;
                return { 
                    factorizable: false, 
                    reason: "El discriminante no es un cuadrado perfecto, por lo que la ecuación no se puede factorizar con números enteros.",
                    discriminantInfo: discriminantInfoText
                };
            }
            
            // Verificar si los factores son enteros
            const factor1 = (-b + sqrtDiscriminant) / (2 * a);
            const factor2 = (-b - sqrtDiscriminant) / (2 * a);
            
            if (factor1 !== Math.floor(factor1) || factor2 !== Math.floor(factor2)) {
                discriminantInfoText += `Los factores no son números enteros (${factor1} y ${factor2}), por lo que la ecuación no se puede factorizar con coeficientes enteros.`;
                return { 
                    factorizable: false, 
                    reason: "Los factores no son números enteros, por lo que la ecuación no se puede factorizar con coeficientes enteros.",
                    discriminantInfo: discriminantInfoText
                };
            }
            
            discriminantInfoText += `El discriminante es un cuadrado perfecto (${discriminant} = ${sqrtDiscriminant}²), por lo que la ecuación es factorizable.`;
            return { 
                factorizable: true, 
                factor1: factor1, 
                factor2: factor2,
                discriminantInfo: discriminantInfoText
            };
        }
        
        // Habilitar entrada de ecuación personalizada
        function enableCustomEquation() {
            currentMode = 'custom';
            updateButtonStates();
            feedbackElement.textContent = 'Ingresa los coeficientes de tu ecuación';
            feedbackElement.className = 'feedback';
            discriminantInfo.classList.add('hidden');
            isCustomEquation = true;
        }
        
        // Deshabilitar entrada de ecuación personalizada
        function disableCustomEquation() {
            isCustomEquation = false;
            generateEquation();
        }
        
        // Verificar ecuación personalizada
        function checkCustomEquation() {
            // Obtener valores
            const aSign = customASign.value;
            const aValue = parseInt(customA.value) || 1;
            const bSign = customBSign.value;
            const bValue = parseInt(customB.value) || 0;
            const cSign = customCSign.value;
            const cValue = parseInt(customC.value) || 0;
            
            // Validar entrada
            if (aValue < 1) {
                feedbackElement.textContent = 'El coeficiente de x² debe ser mayor a 0.';
                feedbackElement.className = 'feedback incorrect';
                return;
            }
            
            // Calcular coeficientes con signos
            const a = aSign === '+' ? aValue : -aValue;
            const b = bSign === '+' ? bValue : -bValue;
            const c = cSign === '+' ? cValue : -cValue;
            
            // Mostrar la ecuación
            displayEquation(a, b, c);
            
            // Verificar si es factorizable
            const result = isFactorizable(a, b, c);
            
            // Mostrar información del discriminante
            discriminantInfo.innerHTML = result.discriminantInfo;
            discriminantInfo.classList.remove('hidden');
            
            if (result.factorizable) {
                // Calcular signos y factores para la factorización
                let factor1 = Math.abs(result.factor1);
                let factor2 = Math.abs(result.factor2);
                let sign1 = result.factor1 >= 0 ? '-' : '+';
                let sign2 = result.factor2 >= 0 ? '-' : '+';
                
                // Ajustar para ecuación cuadrática general (a puede ser diferente de 1)
                if (a !== 1) {
                    // Para ecuaciones con a ≠ 1, necesitamos encontrar factores de a y c
                    // que sumen b. Esto es más complejo y simplificamos para este ejemplo
                    feedbackElement.textContent = '¡Ecuación válida! Ahora intenta factorizarla. Nota: Para ecuaciones con a ≠ 1, la factorización puede ser más compleja.';
                    feedbackElement.className = 'feedback correct';
                    
                    // Para simplificar, asumimos que podemos dividir toda la ecuación por a
                    // para obtener una ecuación con a=1
                    const simplifiedB = b / a;
                    const simplifiedC = c / a;
                    
                    // Encontrar factores para la ecuación simplificada
                    const simplifiedResult = isFactorizable(1, simplifiedB, simplifiedC);
                    if (simplifiedResult.factorizable) {
                        factor1 = Math.abs(simplifiedResult.factor1);
                        factor2 = Math.abs(simplifiedResult.factor2);
                        sign1 = simplifiedResult.factor1 >= 0 ? '-' : '+';
                        sign2 = simplifiedResult.factor2 >= 0 ? '-' : '+';
                    }
                } else {
                    feedbackElement.textContent = '¡Ecuación válida! Ahora intenta factorizarla.';
                    feedbackElement.className = 'feedback correct';
                }
                
                // Actualizar la ecuación actual
                currentEquation = {
                    a: a,
                    b: b,
                    c: c,
                    factor1: factor1,
                    factor2: factor2,
                    sign1: sign1,
                    sign2: sign2,
                    root1: result.factor1,
                    root2: result.factor2
                };
                
                // Cambiar a modo de factorización
                currentMode = 'factorization';
                updateButtonStates();
                
                // Limpiar inputs de factorización
                resetInputs();
                
            } else {
                feedbackElement.textContent = `La ecuación no es factorizable: ${result.reason}`;
                feedbackElement.className = 'feedback incorrect';
            }
        }
        
        // Siguiente ecuación
        function nextEquation() {
            if (isCustomEquation) {
                disableCustomEquation();
            } else {
                generateEquation();
            }
        }
        
        // Función para hacer los menús desplegables
        function setupCollapsibleMenus() {
            const tutorialHeader = document.querySelector('.tutorial h3');
            const controlsHeader = document.querySelector('.controls h3');
            
            tutorialHeader.addEventListener('click', function() {
                document.querySelector('.tutorial').classList.toggle('collapsed');
            });
            
            controlsHeader.addEventListener('click', function() {
                document.querySelector('.controls').classList.toggle('collapsed');
            });
        }
        
        // Configurar event listeners para los botones
        function setupEventListeners() {
            hintBtn.addEventListener('click', giveHint);
            nextBtn.addEventListener('click', nextEquation);
            customBtn.addEventListener('click', function() {
                if (currentMode === 'custom') {
                    disableCustomEquation();
                } else {
                    enableCustomEquation();
                }
            });
            
            // Configurar el botón de verificar según el modo actual
            checkBtn.onclick = function() {
                switch(currentMode) {
                    case 'custom':
                        checkCustomEquation();
                        break;
                    case 'factorization':
                        checkFactorization();
                        break;
                    case 'roots':
                        checkRoots();
                        break;
                }
            };
            
            // Permitir verificar con Enter
            factor1Input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') checkFactorization();
            });
            
            factor2Input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') checkFactorization();
            });
            
            root1Input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') checkRoots();
            });
            
            root2Input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') checkRoots();
            });
        }
        
        // Inicializar el juego
        function initGame() {
            generateEquation();
            setupCollapsibleMenus();
            setupEventListeners();
            
            // Actualizar estadísticas iniciales
            scoreElement.textContent = score;
            correctCountElement.textContent = correctCount;
            attemptsElement.textContent = attempts;
        }
        
        // Iniciar el juego cuando se carga la página
        window.addEventListener('load', initGame);
