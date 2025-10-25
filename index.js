import express from 'express';

const host = '0.0.0.0';
const app = express();
const port = process.env.PORT || 3001;

function calcularReajuste(idade, sexo, salarioBase, anoContratacao) {
    const anoAtual = new Date().getFullYear();
    const tempoEmpresa = anoAtual - anoContratacao;
    
    let reajuste = 0;
    let valorAjuste = 0;
    
    if (idade >= 18 && idade <= 39) {
        if (sexo === 'M') {
            reajuste = 0.10;
            valorAjuste = tempoEmpresa <= 10 ? 10.00 : 17.00;
        } else {
            reajuste = 0.08;
            valorAjuste = tempoEmpresa <= 10 ? 11.00 : 16.00;
        }
    } else if (idade >= 40 && idade <= 69) {
        if (sexo === 'M') {
            reajuste = 0.08;
            valorAjuste = tempoEmpresa <= 10 ? 5.00 : 15.00;
        } else {
            reajuste = 0.10;
            valorAjuste = tempoEmpresa <= 10 ? 7.00 : 14.00;
        }
    } else if (idade >= 70 && idade <= 99) {
        if (sexo === 'M') {
            reajuste = 0.15;
            valorAjuste = tempoEmpresa <= 10 ? 15.00 : 13.00;
        } else {
            reajuste = 0.17;
            valorAjuste = tempoEmpresa <= 10 ? 17.00 : 12.00;
        }
    }
    
    const salarioComReajuste = salarioBase * (1 + reajuste);
    const salarioFinal = salarioComReajuste + valorAjuste;
    
    return {
        reajustePercentual: reajuste * 100,
        valorAjuste: valorAjuste,
        salarioFinal: salarioFinal,
        tempoEmpresa: tempoEmpresa
    };
}

app.get('/', (req, res) => {
    const { idade, sexo, salario_base, anoContratacao, matricula } = req.query;
    
    if (!idade || !sexo || !salario_base || !anoContratacao || !matricula) {
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Calculadora de Reajuste Salarial</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 900px;
                        margin: 50px auto;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .container {
                        background: white;
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #333;
                        text-align: center;
                    }
                    .subtitle {
                        text-align: center;
                        color: #666;
                        margin-bottom: 30px;
                    }
                    .instructions {
                        background: #f8f9fa;
                        padding: 25px;
                        border-radius: 5px;
                        border-left: 4px solid #007bff;
                        margin: 20px 0;
                    }
                    .example {
                        background: #e7f3ff;
                        padding: 15px;
                        border-radius: 5px;
                        font-family: monospace;
                        word-break: break-all;
                        margin: 15px 0;
                        font-size: 14px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: center;
                    }
                    th {
                        background: #007bff;
                        color: white;
                    }
                    tr:nth-child(even) {
                        background: #f9f9f9;
                    }
                    .rules {
                        background: #fff3cd;
                        padding: 20px;
                        border-radius: 5px;
                        border-left: 4px solid #ffc107;
                        margin: 20px 0;
                    }
                    .rules h3 {
                        margin-top: 0;
                        color: #856404;
                    }
                    ul {
                        line-height: 1.8;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Calculadora de Reajuste Salarial</h1>
                    <p class="subtitle">Sistema de Calculo de Reajuste - Empresa Presidente Prudente/SP</p>
                    
                    <div class="instructions">
                        <h2>Como usar:</h2>
                        <p>Informe os dados do funcionario atraves dos parametros na URL seguindo o formato:</p>
                        <div class="example">
                            http://localhost:3000/?idade=18&sexo=F&salario_base=1700&anoContratacao=2014&matricula=12345
                        </div>
                        
                        <h3>Parametros necessarios:</h3>
                        <ul>
                            <li><strong>idade:</strong> idade do funcionario (numero inteiro)</li>
                            <li><strong>sexo:</strong> M (masculino) ou F (feminino)</li>
                            <li><strong>salario_base:</strong> salario base atual (numero decimal)</li>
                            <li><strong>anoContratacao:</strong> ano de contratacao (numero inteiro)</li>
                            <li><strong>matricula:</strong> numero de matricula (numero inteiro)</li>
                        </ul>
                    </div>
                    
                    <div class="rules">
                        <h3>Regras de Validacao:</h3>
                        <ul>
                            <li>A idade deve ser maior que 16 anos</li>
                            <li>O salario base deve ser um numero real valido</li>
                            <li>O ano de contratacao deve ser maior que 1960</li>
                            <li>A matricula deve ser um numero inteiro maior que zero</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3>Tabela de Reajustes:</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Faixa Etaria</th>
                                    <th>Sexo</th>
                                    <th>Reajuste</th>
                                    <th>Desconto (ate 10 anos)</th>
                                    <th>Acrescimo (mais de 10 anos)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td rowspan="2">18-39</td>
                                    <td>M</td>
                                    <td>10%</td>
                                    <td>R$ 10,00</td>
                                    <td>R$ 17,00</td>
                                </tr>
                                <tr>
                                    <td>F</td>
                                    <td>8%</td>
                                    <td>R$ 11,00</td>
                                    <td>R$ 16,00</td>
                                </tr>
                                <tr>
                                    <td rowspan="2">40-69</td>
                                    <td>M</td>
                                    <td>8%</td>
                                    <td>R$ 5,00</td>
                                    <td>R$ 15,00</td>
                                </tr>
                                <tr>
                                    <td>F</td>
                                    <td>10%</td>
                                    <td>R$ 7,00</td>
                                    <td>R$ 14,00</td>
                                </tr>
                                <tr>
                                    <td rowspan="2">70-99</td>
                                    <td>M</td>
                                    <td>15%</td>
                                    <td>R$ 15,00</td>
                                    <td>R$ 13,00</td>
                                </tr>
                                <tr>
                                    <td>F</td>
                                    <td>17%</td>
                                    <td>R$ 17,00</td>
                                    <td>R$ 12,00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </body>
            </html>
        `);
        return;
    }
    
    const idadeNum = parseInt(idade);
    const salarioBaseNum = parseFloat(salario_base);
    const anoContratacaoNum = parseInt(anoContratacao);
    const matriculaNum = parseInt(matricula);
    
    const erros = [];
    
    if (isNaN(idadeNum) || idadeNum <= 16) {
        erros.push('A idade deve ser um numero maior que 16 anos');
    }
    
    if (sexo !== 'M' && sexo !== 'F') {
        erros.push('O sexo deve ser M (masculino) ou F (feminino)');
    }
    
    if (isNaN(salarioBaseNum) || salarioBaseNum <= 0) {
        erros.push('O salario base deve ser um numero real valido e maior que zero');
    }
    
    if (isNaN(anoContratacaoNum) || anoContratacaoNum <= 1960) {
        erros.push('O ano de contratacao deve ser um numero inteiro maior que 1960');
    }
    
    if (isNaN(matriculaNum) || matriculaNum <= 0) {
        erros.push('A matricula deve ser um numero inteiro maior que zero');
    }
    
    if (erros.length > 0) {
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Erro na Validacao</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 50px auto;
                        padding: 20px;
                        background-color: #f5f5f5;
                    }
                    .container {
                        background: white;
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    h1 {
                        color: #d32f2f;
                        text-align: center;
                    }
                    .error-box {
                        background: #ffebee;
                        padding: 20px;
                        border-radius: 5px;
                        border-left: 4px solid #d32f2f;
                        margin: 20px 0;
                    }
                    ul {
                        line-height: 2;
                    }
                    .back-button {
                        display: block;
                        text-align: center;
                        margin: 30px auto;
                        padding: 15px 30px;
                        background: #007bff;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        width: fit-content;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Dados Invalidos</h1>
                    <div class="error-box">
                        <h3>Nao foi possivel realizar o calculo. Erros encontrados:</h3>
                        <ul>
                            ${erros.map(erro => `<li>${erro}</li>`).join('')}
                        </ul>
                    </div>
                    <a href="/" class="back-button">Voltar para o inicio</a>
                </div>
            </body>
            </html>
        `);
        return;
    }
    
    const resultado = calcularReajuste(idadeNum, sexo, salarioBaseNum, anoContratacaoNum);
    
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resultado do Reajuste Salarial</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 900px;
                    margin: 50px auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: white;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .info-card {
                    background: #f8f9fa;
                    padding: 25px;
                    border-radius: 5px;
                    margin: 20px 0;
                    border-left: 4px solid #007bff;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #e0e0e0;
                }
                .info-row:last-child {
                    border-bottom: none;
                }
                .info-label {
                    font-weight: bold;
                    color: #555;
                }
                .info-value {
                    color: #333;
                }
                .salary-highlight {
                    background: #007bff;
                    color: white;
                    padding: 30px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 30px 0;
                }
                .salary-highlight h2 {
                    margin: 0 0 15px 0;
                    font-size: 24px;
                }
                .salary-value {
                    font-size: 48px;
                    font-weight: bold;
                    margin: 10px 0;
                }
                .details {
                    font-size: 14px;
                    margin-top: 15px;
                }
                .back-button {
                    display: block;
                    text-align: center;
                    margin: 30px auto 0;
                    padding: 15px 30px;
                    background: #007bff;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    width: fit-content;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Calculo de Reajuste Concluido</h1>
                
                <div class="info-card">
                    <h3 style="margin-top: 0;">Dados do Funcionario</h3>
                    <div class="info-row">
                        <span class="info-label">Matricula:</span>
                        <span class="info-value">${matriculaNum}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Idade:</span>
                        <span class="info-value">${idadeNum} anos</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Sexo:</span>
                        <span class="info-value">${sexo === 'M' ? 'Masculino' : 'Feminino'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Ano de Contratacao:</span>
                        <span class="info-value">${anoContratacaoNum}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Tempo de Empresa:</span>
                        <span class="info-value">${resultado.tempoEmpresa} anos</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Salario Base Atual:</span>
                        <span class="info-value">R$ ${salarioBaseNum.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="info-card">
                    <h3 style="margin-top: 0;">Detalhes do Reajuste</h3>
                    <div class="info-row">
                        <span class="info-label">Reajuste Percentual:</span>
                        <span class="info-value">${resultado.reajustePercentual}%</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">${resultado.tempoEmpresa <= 10 ? 'Desconto Aplicado' : 'Acrescimo Aplicado'}:</span>
                        <span class="info-value">R$ ${resultado.valorAjuste.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="salary-highlight">
                    <h2>Novo Salario Reajustado</h2>
                    <div class="salary-value">R$ ${resultado.salarioFinal.toFixed(2)}</div>
                    <div class="details">
                        Salario com reajuste de ${resultado.reajustePercentual}% ${resultado.tempoEmpresa <= 10 ? 'menos' : 'mais'} R$ ${resultado.valorAjuste.toFixed(2)}
                    </div>
                </div>
                
                <a href="/" class="back-button">Calcular novo reajuste</a>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, host, () => {
    console.log(`Servidor rodando em http://${host}:${port}`);
});

export default app;