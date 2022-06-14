const express = require('express')
const cors = require('cors')
const { pool } = require('./config')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const getProdutos = (request, response) => {
    pool.query('select * from produtos', (error, results) => {
        if (error) {
            return response.status(400).json({
                status: 'error',
                message: 'Erro ao recuperar os produtos: ' + error
            })
        }
        response.status(200).json(results.rows);
    })
}

const addProdutos = (request, response) => {
    const { nome, preco, estoque } = request.body;
    pool.query(`INSERT INTO produtos (nome, preco, estoque) 
                VALUES ($1, $2, $3) 
                RETURNING codigo, nome, preco, estoque`,
        [nome, preco, estoque],
        (error, results) => {
            if (error) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Erro ao inserir produto! : ' + error
                })
            }
            response.status(200).json({
                status: 'success', message: 'Produto criado!',
                objeto: results.rows[0]
            });
        })
}

const updateProdutos = (request, response) => {
    const { codigo, nome, preco, estoque } = request.body;
    pool.query(`UPDATE produtos set nome=$1, preco = $2, estoque = $3
                WHERE codigo = $4
                RETURNING codigo, nome, preco, estoque`,
        [nome, preco, estoque, codigo],
        (error, results) => {
            if (error) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Erro ao atualizar produto! : ' + error
                })
            }
            response.status(200).json({
                status: 'success', message: 'Produto atualizado!',
                objeto: results.rows[0]
            });
        })
}

const deleteProdutos = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    console.log('codigo: '+ codigo);
    pool.query(`DELETE FROM produtos
                WHERE codigo = $1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Erro ao remover produto! : ' + (error ? error :'')
                })
            }
            response.status(200).json({
                status: 'success', message: 'Produto removido!'
            });
        })
}

const getProdutoPorCodigo = (request, response) => {
    const  codigo  = parseInt(request.params.codigo);
    console.log('codigo: '+ codigo);
    pool.query(`SELECT * FROM produtos
                WHERE codigo = $1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json({
                    status: 'error',
                    message: 'Erro ao recuperar produto! : ' + (error ? error :'')
                })
            }
            response.status(200).json(results.rows[0]);
        })
}

app.route('/produtos')
   .get(getProdutos)
   .post(addProdutos)
   .put(updateProdutos)
app.route('/produtos/:codigo')
   .get(getProdutoPorCodigo)
   .delete(deleteProdutos)

app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor rodando....');
})
