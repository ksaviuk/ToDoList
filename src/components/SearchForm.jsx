import React, { useRef, useState } from "react";
import '../style/SearchForm.css'
import axios from 'axios'
import IssuesBlock from "./IssuesBlock";

const SearchForm = () => {
    let textInput = useRef()
    const [storageBoards, setStorageBoards] = useState([])
    const [urlAdress, setUrlAdress] = useState('')
    const [openIssues, setOpenIssues] = useState([])
    const [closedIssues, setClosedIssues] = useState([])
    const [issues, setIssues] = useState([])
    const [boards, setBoards] = useState([])
    const [currentBoard, setCurrentBoard] = useState(null)
    const [currentIssue, setCurrentIssue] = useState(null)

    function days(x) {
        return Math.round((Date.now() - +new Date(x)) / 86400000)
    }
    function way(str) {
        return str.split('/').slice(-2).join(' > ')
    }
    function storage(str) {
        if (str.length > 0) {
            localStorage.setItem(`boards ${urlAdress}`, JSON.stringify(boards))
        }
    }

    async function load(e) {
        e.preventDefault()
        let url = textInput.current.value.split('/').slice(-2).join('/')
        const openResponce = await axios.get(`https://api.github.com/repos/${url}/issues?state=open`)
        const closedResponce = await axios.get(`https://api.github.com/repos/${url}/issues?state=closed`)
        let urlAdress = textInput.current.value
        setOpenIssues(openResponce.data)
        setClosedIssues(closedResponce.data)
        setIssues(openResponce.data.concat(closedResponce.data))
        JSON.parse(localStorage.getItem(`boards ${urlAdress}`), JSON.stringify(boards)) ? 
        setBoards(JSON.parse(localStorage.getItem(`boards ${urlAdress}`), JSON.stringify(boards)))
        :
        setBoards([
            { id: 1, title: "open", issues: openResponce.data.filter(assig => assig.assignees.length === 0) },
            { id: 2, title: "in progres", issues: openResponce.data.filter(assig => assig.assignees.length > 0) },
            { id: 3, title: "done", issues: closedResponce.data }
        ])
        setUrlAdress(textInput.current.value)
        textInput.current.value = ''
    }

    function dragStartHandler(e, board, issue) {
        setCurrentBoard(board)
        setCurrentIssue(issue)
    }

    function dragEndHandler(e) {
        e.target.style.boxShadow = 'none'
    }

    function dragOverHandler(e) {
        e.preventDefault()
        if (e.target.className === 'item') {
            e.target.style.boxShadow = '0 4px 3px gray'
        }
    }

    function dragLeaveHandler(e) {
        e.target.style.boxShadow = 'none'
    }

    function dropHandler(e, board, issue) {
        e.preventDefault()
        const currentIndex = currentBoard.issues.indexOf(currentIssue)
        currentBoard.issues.splice(currentIndex, 1)
        const dropIndex = board.issues.indexOf(issue)
        board.issues.splice(dropIndex + 1, 0, currentIssue)
        setBoards(boards.map(b => {
            if (b.id === board.id) {
                return board
            }
            if (b.id === currentBoard.id) {
                return currentBoard
            }
            return b
        }))
        e.target.style.boxShadow = 'none'
    }

    function dropCardHandler(e, board) {
        board.issues.push(currentIssue)
        const currentIndex = currentBoard.issues.indexOf(currentIssue)
        currentBoard.issues.splice(currentIndex, 1)
        setBoards(boards.map(b => {
            if (b.id === board.id) {
                return board
            }
            if (b.id === currentBoard.id) {
                return currentBoard
            }
            return b
        }))
        e.target.style.boxShadow = 'none'
    }

    return (
        <div>
            <div className='search_form'>
                <input className='input' type='text' placeholder='Enter URL' ref={textInput} />
                <button className='button' style={{ marginLeft: 15 }} onClick={load}>Load issues</button>
            </div>
            {urlAdress ? <div className="way"><b>{way(urlAdress)}</b></div> : <></>}
            <div className='issues_list'>
                <div>
                    <div className='issues_name'>Open</div>
                    <div className='issues_box'>
                        {boards.filter(boardO => boardO.title === 'open').map(board =>
                            <div key={board.id} className='board' onDragOver={(e) => dragOverHandler(e)} onDrop={(e) => dropCardHandler(e, board)}>
                                {board.issues.map(issue =>
                                    <div
                                        onDragStart={(e) => dragStartHandler(e, board, issue)}
                                        onDragLeave={(e) => dragLeaveHandler(e)}
                                        onDragEnd={(e) => dragEndHandler(e)}
                                        onDragOver={(e) => dragOverHandler(e)}
                                        onDrop={(e) => dropHandler(e, board, issue)}
                                        className='item'
                                        draggable={true}
                                        key={issue.id}>
                                        <IssuesBlock issue={issue} days={days} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className='issues_name'>In Progress</div>
                    <div className='issues_box'>
                        {boards.filter(boardIn => boardIn.title === 'in progres').map(board =>
                            <div key={board.id} className='board' onDragOver={(e) => dragOverHandler(e)} onDrop={(e) => dropCardHandler(e, board)}>
                                {board.issues.map(issue =>
                                    <div
                                        onDragStart={(e) => dragStartHandler(e, board, issue)}
                                        onDragLeave={(e) => dragLeaveHandler(e)}
                                        onDragEnd={(e) => dragEndHandler(e)}
                                        onDragOver={(e) => dragOverHandler(e)}
                                        onDrop={(e) => dropHandler(e, board, issue)}
                                        className='item'
                                        draggable={true}
                                        key={issue.id}>
                                        <IssuesBlock issue={issue} days={days} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className='issues_name'>Done</div>
                    <div className='issues_box'>
                        {boards.filter(boardD => boardD.title === 'done').map(board =>
                            <div key={board.id} className='board' onDragOver={(e) => dragOverHandler(e)} onDrop={(e) => dropCardHandler(e, board)}>
                                {board.issues.map(issue =>
                                    <div
                                        onDragStart={(e) => dragStartHandler(e, board, issue)}
                                        onDragLeave={(e) => dragLeaveHandler(e)}
                                        onDragEnd={(e) => dragEndHandler(e)}
                                        onDragOver={(e) => dragOverHandler(e)}
                                        onDrop={(e) => dropHandler(e, board, issue)}
                                        className='item'
                                        draggable={true}
                                        key={issue.id}>
                                        <IssuesBlock issue={issue} days={days} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {storage(urlAdress)}
        </div>
    )
}

export default SearchForm
