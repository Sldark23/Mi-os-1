const fs = require('fs');
const path = require('path');
const readline = require('readline');
const axios = require('axios');
const cheerio = require('cheerio');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filesFolderPath = path.join(__dirname, 'amarzenamento');

function showFiles() {
  fs.readdir(filesFolderPath, (err, files) => {
    if (err) {
      console.error('Erro ao ler a pasta de arquivos:', err);
    } else {
      console.log('\n╭─────────────── Arquivos ───────────────╮');
      files.forEach((file) => {
        console.log(`│ ${file}`);
      });
      console.log('╰───────────────────────────────────────╯');
      showMenu();
    }
  });
}

function createFile() {
  rl.question('\nDigite o nome do arquivo a ser criado: ', (name) => {
    const newFilePath = path.join(filesFolderPath, name);

    if (!name) {
      console.error('O nome do arquivo é obrigatório.');
      showMenu();
      return;
    }

    // Verifica se o arquivo já existe
    if (fs.existsSync(newFilePath)) {
      console.error('Já existe um arquivo com esse nome.');
      showMenu();
      return;
    }

    // Cria o arquivo
    fs.writeFile(newFilePath, '', (err) => {
      if (err) {
        console.error('Erro ao criar o arquivo:', err);
      } else {
        console.log('Arquivo criado com sucesso!');
      }
      showMenu();
    });
  });
}

function createFolder() {
  rl.question('\nDigite o nome da pasta a ser criada: ', (name) => {
    const newFolderPath = path.join(filesFolderPath, name);

    if (!name) {
      console.error('O nome da pasta é obrigatório.');
      showMenu();
      return;
    }

    // Verifica se a pasta já existe
    if (fs.existsSync(newFolderPath)) {
      console.error('Já existe uma pasta com esse nome.');
      showMenu();
      return;
    }

    // Cria a pasta
    fs.mkdir(newFolderPath, (err) => {
      if (err) {
        console.error('Erro ao criar a pasta:', err);
      } else {
        console.log('Pasta criada com sucesso!');
      }
      showMenu();
    });
  });
}

function openBrowser() {
  rl.question('\nDigite a URL da página que deseja visitar (ou "sair" para voltar): ', (answer) => {
    if (answer.toLowerCase() === 'sair') {
      showMenu();
    } else {
      axios
        .get(answer)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          const pageTitle = $('title').text();
          console.log('\n=== ' + pageTitle + ' ===\n');
          console.log($('body').text());
          showMenu();
        })
        .catch((error) => {
          console.error('Erro ao carregar a página:', error.message);
          showMenu();
        });
    }
  });
}

const apps = [
  { name: 'Arquivos', action: showFiles },
  { name: 'Criar Arquivo', action: createFile },
  { name: 'Criar Pasta', action: createFolder },
  { name: 'Navegador', action: openBrowser },
];

function showMenu() {
  console.log('\n===== Aplicativos =====\n');
  apps.forEach((app, index) => {
    console.log(`${index + 1}. ${app.name}`);
  });

  rl.question('\nDigite o número do aplicativo desejado: ', (answer) => {
    const appIndex = parseInt(answer) - 1;
    if (appIndex >= 0 && appIndex < apps.length) {
      const selectedApp = apps[appIndex];
      selectedApp.action();
    } else {
      console.log('\nOpção inválida. Tente novamente.\n');
      showMenu();
    }
  });
}

function main() {
  console.log('\nBem-vindo ao Sistema Operacional do Termux!\n');
  showMenu();
}

main();
