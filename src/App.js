import './App.css';
import React, {Component} from 'react';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                TODO LIST APP
            </header>
            <Editor/>
        </div>
    );
}

class Editor extends Component {
    NAME = () => 'NAME';
    DUE_DATE = () => 'DUE_DATE';

    constructor(props) {
        super(props)
        const ls = {...localStorage};
        this.state = {
            current: {
                title: '',
                description: '',
                dueDate: '',
                complete: ''
            },
            todos: Object.keys(ls).map(k => JSON.parse(ls[k])),
            sortBy: this.DUE_DATE(),
            sortOrderAsc: true
        }
    }

    handleOnChangeDescription(event) {
        this.setState({
            ...this.state,
            current: {
                ...this.state.current,
                description: event.target.value
            }
        })
    }

    handleOnChangeDueDate(event) {
        this.setState({
            ...this.state,
            current: {
                ...this.state.current,
                dueDate: event.target.value
            }
        })
    }

    handleOnChangeTitle(event) {
        this.setState({
            ...this.state,
            current: {
                ...this.state.current,
                title: event.target.value
            }
        })
    }

    handleOnSubmit(event) {
        event.preventDefault();
        localStorage.setItem(`key-${new Date().toLocaleString()}`, JSON.stringify(this.state.current))
        this.setState({
            ...this.state,
            todos: this.state.todos.concat([this.state.current]),
            current: {
                title: '',
                description: '',
                dueDate: '',
                complete: false
            },
        })
    }

    trashSvg() {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24">
                <path
                    d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/>
            </svg>
        )
    }

    tickSvg() {
        return (<svg xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24">
                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
            </svg>
        )
    }

    arrowSvg() {
        return (<svg xmlns="http://www.w3.org/2000/svg"
                     width="24"
                     height="24"
                     viewBox="0 0 24 24">
            <path d="M8.122 24l-4.122-4 8-8-8-8 4.122-4 11.878 12z"/>
        </svg>);
    }

    lineSvg() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg"
                 version="1.1"
                 id="Layer_1"
                 viewBox="0 0 25 25">
                <g>
                    <rect xmlns="http://www.w3.org/2000/svg" x="0" y="6.504" width="20.969" height="7.961"/>
                </g>
            </svg>
        )
    }

    handleDelete(todo) {
        const ls = {...localStorage};
        const toDelete = Object.keys(ls)
            .map(k => [k, JSON.parse(ls[k])])
            .filter(cpl => cpl[1].title === todo.title
                && cpl[1].dueDate === todo.dueDate
                && cpl[1].description === todo.description
                && cpl[1].complete === todo.complete)[0];
        localStorage.removeItem(`${toDelete[0]}`)
        const tmp = [...this.state.todos];
        tmp.splice(this.state.todos.indexOf(todo), 1)
        this.setState({
            ...this.state,
            todos: tmp,
            current: {
                title: '',
                description: '',
                dueDate: '',
                complete: false
            },
        })
    }

    handleComplete(todo) {
        const newValue = {
            ...todo,
            complete: !todo.complete
        };
        const ls = {...localStorage};
        const item = Object.keys(ls)
            .map(k => [k, JSON.parse(ls[k])])
            .filter(cpl => cpl[1].title === todo.title
                && cpl[1].dueDate === todo.dueDate
                && cpl[1].description === todo.description
                && cpl[1].complete === todo.complete)[0];

        localStorage.removeItem(`${item[0]}`)
        localStorage.setItem(item[0], JSON.stringify(newValue));

        const tmp = [...this.state.todos, newValue];
        tmp.splice(this.state.todos.indexOf(todo), 1)
        this.setState({
            ...this.state,
            todos: tmp,
            current: {
                title: '',
                description: '',
                dueDate: '',
                complete: false
            },
        })
    }

    handleSortUpdate(kind) {
        this.setState({
            ...this.state,
            sortBy: kind,
            sortOrderAsc: this.state.sortBy !== kind ? true : !this.state.sortOrderAsc
        })
    }

    sortButton(sortBy, sortOrderAsc, kind) {
        return <button
            className={sortBy === kind ? sortOrderAsc ? 'sort-asc' : 'sort-desc' : ''}
            onClick={() => this.handleSortUpdate(kind)}
        >
            {sortBy === kind ? this.arrowSvg() : this.lineSvg()}
        </button>
    }


    render() {
        const submitDisabled = this.state.current.description === ''
            || this.state.current.title === ''
            || this.state.current.dueDate === '';

        return (

            <div className="content">
                <div className="left">
                    <form className="todo-form" onSubmit={(event) => this.handleOnSubmit(event)}>
                        <label htmlFor="todo-title">Title</label>
                        <input type="text"
                               id="todo-title"
                               value={this.state.current.title}
                               onChange={(event => this.handleOnChangeTitle(event))}/>
                        <label htmlFor="todo-desc">Description</label>
                        <textarea
                            id="todo-desc"
                            rows={10}
                            cols={30}
                            value={this.state.current.description}
                            onresize={() => {
                            }}
                            onChange={(event) => this.handleOnChangeDescription(event)}/>
                        <label htmlFor="todo-date">Due date</label>
                        <input type="date" id="todo-date" value={this.state.current.dueDate}
                               onChange={(event => this.handleOnChangeDueDate(event))}/>
                        <input type="submit" className="todo-form-submit" value="Save" disabled={submitDisabled}/>
                    </form>
                </div>

                <div className="right">

                    <table>
                        <thead>
                            <tr>
                                <th scope="col">
                                    <div>Todo{this.sortButton(this.state.sortBy, this.state.sortOrderAsc, this.NAME())}</div>
                                </th>
                                <th scope="col">
                                    <div>Due
                                        date{this.sortButton(this.state.sortBy, this.state.sortOrderAsc, this.DUE_DATE())}</div>
                                </th>
                                <th scope="col" className="action-cell">
                                    <div>Action</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.todos
                                .sort((a, b) => {
                                    switch (this.state.sortBy) {
                                        case "DUE_DATE":
                                            return this.state.sortOrderAsc ? a.dueDate > b.dueDate ? -1 : 1 : b.dueDate > a.dueDate ? -1 : 1;
                                        case "NAME":
                                        default:
                                            return this.state.sortOrderAsc ? a.title > b.title ? -1 : 1 : b.title > a.title ? -1 : 1;

                                    }
                                })
                                .map(v => (<>
                                        <tr className="row_one">
                                            <td className={v.complete ? 'strike' : ''}>{v.title}</td>
                                            <td className={v.complete ? 'strike' : ''}>{v.dueDate}</td>
                                            <td
                                                rowSpan="2"
                                                className={`action-cell ${v.complete ? 'strike' : ''}`}
                                            >
                                                <button
                                                    className="complete"
                                                    disabled={v.complete}
                                                    onClick={() => this.handleComplete(v)}>
                                                    {this.tickSvg()}
                                                </button>
                                                <button
                                                    className="delete"
                                                    onClick={() => this.handleDelete(v)}>
                                                    {this.trashSvg()}
                                                </button>
                                            </td>
                                        </tr>
                                        <tr className="row_two">
                                            <td  colSpan="2" className={v.complete ? 'strike' : ''}>{v.description}</td>
                                        </tr>
                                    </>
                                ))}
                            {this.state.todos.length === 0 ?
                                (<tr>
                                    <td colSpan="3">The to do list is empty</td>
                                </tr>)
                                : (<></>)}
                        </tbody>
                    </table>
                </div>
            </div>
        )

    }
}


export default App;
