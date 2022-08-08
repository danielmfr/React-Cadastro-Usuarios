import React, { Component } from 'react';
import Main from '../template/Main';
import axios from 'axios';

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3001/users'

const initialState = {
    user: {name: '', email:''},
    list: []
}

class UserCrud extends Component {

    constructor(props) {
        super(props)
        this.clear = this.clear.bind(this)
        this.save = this.save.bind(this)
    }

    state = {...initialState}

    // Função que será chamada quando o componente for exibido na tela.
    // Ou seja, obter a lista do que está cadastrado no back-end (db.json).
    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    // Limpar o formulário
    clear() {
        this.setState({ user: initialState.user })
    }

    // Somente uma função para salvar e incluir
    save() {
        const user = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
        axios[method](url, user).then(resp => {
            const list = this.getUpdatedList(resp.data)
            this.setState({ user: initialState.user, list })
        })
    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if (add)
            list.unshift(user)
        return list
    }

    // Atualizar campos de nome e email 
    updateField(event) {
        const user = {...this.state.user}
        user[event.target.name] = event.target.value // Vai usar o nome do input para procurar o valor no 'state' e 'setar' o valor no campo de input
        this.setState({ user })
    }

    // Atualizar o estado
    load(user) {
        this.setState({ user })
    }

    // Remove um usuário
    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false) // O filtro já é realizado na função
            this.setState({ list })
        })
    }

    // JSX que vai renderizar o formulário
    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" name="name" placeholder='Digite o nome...' className='form-control' value={this.state.user.name} onChange={e => this.updateField(e)} />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" name="email" placeholder='Digite o e-mail...' className='form-control' value={this.state.user.email} onChange={e => this.updateField(e)} />
                        </div>
                    </div>
                </div>
                
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary mr-2" onClick={this.save}>Salvar</button>
                        <button className="btn btn-secondary ml-2" onClick={this.clear}>Cancelar</button>
                    </div>
                </div>
            </div>
        )
    }

    // JSX que vai renderizar a tabela
    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    // JSX que vai renderizar as linhas da tabela
    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <button className="btn btn-warning" onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2" onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() { 

        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        );
    }
}
 
export default UserCrud;