const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('./firebaseConfig');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/api/produtos', (req, res) => {
  const { body } = req;

  db.collection('produtos')
    .add(body)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('Erro ao criar documento:', error);
      res.sendStatus(500);
    });
});

app.get('/api/produtos', (req, res) => {
  db.collection('produtos')
    .get()
    .then((snapshot) => {
      const documentos = [];
      snapshot.forEach((doc) => {
        documentos.push({ id: doc.id, ...doc.data() });
      });
      res.json(documentos);
    })
    .catch((error) => {
      console.error('Erro ao obter documentos:', error);
      res.sendStatus(500);
    });
});

app.get('/api/produtos/:id', (req, res) => {
  const { id } = req.params;

  db.collection('produtos')
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        res.json({ id: doc.id, ...doc.data() });
      } else {
        res.sendStatus(404);
      }
    })
    .catch((error) => {
      console.error('Erro ao obter documento:', error);
      res.sendStatus(500);
    });
});

app.put('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { body } = req;

  db.collection('produtos')
    .doc(id)
    .set(body, { merge: true })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Erro ao atualizar documento:', error);
      res.sendStatus(500);
    });
});

// Rota para excluir um documento
app.delete('/api/produtos/:id', (req, res) => {
  const { id } = req.params;

  db.collection('produtos')
    .doc(id)
    .delete()
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      console.error('Erro ao excluir documento:', error);
      res.sendStatus(500);
    });
});

const produtosJSON = [
  {
    "nome": "Produto 1",
    "preco": 10.99,
    "descricao": "Descrição do Produto 1"
  },
  {
    "nome": "Produto 2",
    "preco": 19.99,
    "descricao": "Descrição do Produto 2"
  },
  {
    "nome": "Produto 3",
    "preco": 5.99,
    "descricao": "Descrição do Produto 3"
  }
];

// Insere os dados no Firestore
produtosJSON.forEach((produto) => {
  db.collection('produtos').add(produto);
});

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
