import { loadData, seqAvarage, seqGeneric, seqCols6, seqBonus, comboCheck } from "./src/superenalotto.mjs"

const app = document.getElementById('app')

function view(title, seq, idx) {
    // seqContainer
    const seqContainer = document.createElement('div')
    seqContainer.classList.add('container')
    const p = document.createElement('p')
    p.textContent = title

    try {
        seq.forEach(num => {
            const div = document.createElement('div')
            div.classList.add('item')
            div.textContent = num[idx]
            if (num[0] === 'jolly') {
                div.classList.add('jolly')
            } else if (num[0] === 'sstar') {
                div.classList.add('sstar')
            }
            seqContainer.appendChild(div)
        })
        app.append(p, seqContainer)
    } catch (err) {
        console.log(err)
    }
}

const view6cols = (title, seq, range) => {
    // seqContainer
    const seqContainer = document.createElement('div')
    seqContainer.classList.add('container')
    const p = document.createElement('p')
    p.textContent = title
    // app.appendChild(p)

    try {
        seq.forEach(obj => {

            const div = document.createElement('div')
            div.classList.add('title-item')
            div.textContent = obj[0]

            const container6Cols = document.createElement('div')
            container6Cols.appendChild(div)

            container6Cols.classList.add('container-col')

            Object.entries(obj[1])
                .sort((a, b) => b[1] - a[1])
                .slice(0, +range)
                .forEach(num => {
                    const div = document.createElement('div')
                    div.classList.add('item')
                    div.textContent = num[0]
                    container6Cols.appendChild(div)
                    seqContainer.appendChild(container6Cols)
                })
            app.append(p, seqContainer)
        })
    } catch (err) {
        console.log(err)
    }
}

const viewBonus = (title, bonus) => {
    // seqContainer
    const seqContainer = document.createElement('div')
    seqContainer.classList.add('container-bonus')
    const p = document.createElement('p')
    p.textContent = title
    // app.appendChild(p)

    bonus.forEach(arr => {
        const bonusCols = document.createElement('div')
        bonusCols.classList.add('bonus-col')

        arr.forEach((num, idx) => {
            const div = document.createElement('div')
            div.classList.add('item')
            idx == 0 ? div.classList.add('jolly') : div.classList.add('sstar')
            div.textContent = num
            bonusCols.appendChild(div)
            seqContainer.appendChild(bonusCols)
        })
        app.append(p, seqContainer)
    })
}

const viewCombo = (element, seq = 0) => {
    element.textContent = ''
    if (seq.length !== 5) return
    seq.forEach((arr, idx) => {
        const star = (idx) => '&starf;'.repeat(idx + 2)
        const span = document.createElement('span')
        span.classList.add('combo-search-item')
        span.innerHTML = `${star(idx)} (${arr[0]}) ${arr[1].toFixed(1)}%`
        element.appendChild(span)
    })
}

async function jsonData(data) {
    const url = `./data/${data}`
    const dataJson = await loadData(url)
    return dataJson
}

async function viewAll(data, range) {
    app.textContent = ''
    // const url = `./data/${'test.json'}`
    // const url = `./data/${data}`
    // const dataJson = await loadData(url)

    const dataJson = await jsonData(data)

    const jolly = seqBonus(dataJson, 'Jolly', range)
    const sstar = seqBonus(dataJson, 'S.Star', range)

    const bonus = jolly.map((num, idx) => [num[0], sstar[idx][0]])

    view('Media', seqAvarage(dataJson), 1)
    view('Ritardi (generici)', seqGeneric(dataJson, 'asc', range), 0)
    view('Frequenze (generiche)', seqGeneric(dataJson, 'desc', range), 0)
    view6cols('Frequenze per colonna', seqCols6(dataJson), range)
    viewBonus('Frequenze jolly / S.Star', bonus)

}
// init 
void async function init() {
    const dataJsonSelect = document.getElementById('data-json')
    const dataRangeSelect = document.getElementById('data-range')
    const comboSearchText = document.getElementById('combo-search-text')
    const comboSearchBtn = document.getElementById('combo-search-btn')
    const comboSearchResult = document.getElementById('combo-search-result')

    dataJsonSelect.addEventListener('change', (e) => {
        viewAll(e.target.value, dataRangeSelect.value)
    })

    dataRangeSelect.addEventListener('change', (e) => {
        viewAll(dataJsonSelect.value, e.target.value)
    })

    comboSearchBtn.addEventListener('click', async () => {
        const data = `${dataJsonSelect.value}`
        // const data = `${'test.json'}`
        const dataJson = await jsonData(data)
        const comboArr = String(comboSearchText.value).split('-').map(num => +num)

        // console.log(comboCheck(dataJson, comboArr))
        viewCombo(comboSearchResult, comboCheck(dataJson, comboArr))
        // comboCheck(dataJson, comboArr)
    })

    viewAll(dataJsonSelect.value, dataRangeSelect.value)
}()
