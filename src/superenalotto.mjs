// load json data
export const loadData = async (url) => {
    const response = await fetch(url)
    const result = await response.json()
    return result
}
// generate obj first 90 numbers
const gen90 = () => {
    const all90 = {}
    for (let i = 1; i < 91; i++) {
        all90[i] = 0
    }
    return all90
}
// generate obj 6 cols within 90 numbers
const genCols6 = () => {
    const cols6 = {}
    for (let i = 1; i < 7; i++) {
        cols6[i] = gen90()
    }
    return cols6
}
// seqAvarange
export const seqAvarage = (seqNums) => {
    const len = seqNums.length
    const lenSstar = seqNums.filter(num => num['S.Star'] !== 0).length
    const res = seqNums.reduce((result, obj) => {
        result.uno += +obj['1'] / len
        result.due += +obj['2'] / len
        result.tre += +obj['3'] / len
        result.quattro += +obj['4'] / len
        result.cinque += +obj['5'] / len
        result.sei += +obj['6'] / len
        result.jolly += +obj['Jolly'] / len
        if (+obj['S.Star'] != 0) result.sstar += +obj['S.Star'] / lenSstar
        return result
    }, {
        'uno': 0,
        'due': 0,
        'tre': 0,
        'quattro': 0,
        'cinque': 0,
        'sei': 0,
        'jolly': 0,
        'sstar': 0
    })
    res['uno'] = parseInt(res['uno'])
    res['due'] = parseInt(res['due'])
    res['tre'] = parseInt(res['tre'])
    res['quattro'] = parseInt(res['quattro'])
    res['cinque'] = parseInt(res['cinque'])
    res['sei'] = parseInt(res['sei'])
    res['jolly'] = parseInt(res['jolly'])
    res['sstar'] = parseInt(res['sstar'])
    return Object.entries(res)
}
// seqGeneric
export const seqGeneric = (seqNums, order, range) => {
    // assign 90 numbers
    const all90 = gen90()
    const sortOrder = order == 'asc'
        ? (a, b) => a[1] - b[1]
        : (order == 'desc')
            ? (a, b) => b[1] - a[1]
            : null

    seqNums.forEach(obj => {
        for (const k in obj) {
            if (+k) {
                for (const j in all90) {
                    if (+j == obj[k]) ++all90[j]
                }
            }
        }
    })
    return Object.entries(all90)
        .sort(sortOrder)
        .slice(0, +range)
    // .sort((a, b) => a[0] - b[0])
}
//seqCols6
export const seqCols6 = (seqNums) => {
    const cols6 = genCols6()
    // const sortOrder = order == 'asc'
    //     ? (a, b) => a[1] - b[1]
    //     : (order == 'desc')
    //         ? (a, b) => b[1] - a[1]
    //         : null

    seqNums.forEach(obj => {
        for (const k in obj) {
            if (+k) {
                for (const j in cols6) {
                    if (+k == +j) {
                        for (const z in cols6[j]) {
                            if (+z == obj[k]) ++cols6[j][z]
                        }
                    }
                }
            }
        }
    })
    return Object.entries(cols6)
}
// @param bonusType : string ['Jolly' | 'S.Star']
export const seqBonus = (seqNums, bonusType, range) => {
    const bonus = gen90()
    seqNums.forEach(obj => {
        for (const k in obj) {
            if (k === bonusType) {
                for (const j in bonus) {
                    if (+j == obj[k]) ++bonus[j]
                }
            }
        }
    })
    return Object.entries(bonus).sort((a, b) => b[1] - a[1]).slice(0, range)
}

export const comboCheck = (seqNums, comboArr) => {
    if (comboArr.length !== 6) return alert('inserire 6 numeri in formato n-n-n-n-n-n')
    const result = {
        "2-stelle": [0, 0],
        "3-stelle": [0, 0],
        "4-stelle": [0, 0],
        "5-stelle": [0, 0],
        "6-stelle": [0, 0],
    }
    const allCombo = []

    seqNums.forEach(obj => {
        allCombo.push([obj[1], obj[2], obj[3], obj[4], obj[5], obj[6]])
    })
    allCombo
        .map(arr => arr.filter(num => comboArr.includes(num)))
        .forEach(arr => {
            switch (arr.length) {
                case 2:
                    result["2-stelle"][0] += 1
                    result["2-stelle"][1] = calcPerc(result["2-stelle"][0], allCombo.length)
                    break;
                case 3:
                    result["3-stelle"][0] += 1
                    result["3-stelle"][1] = calcPerc(result["3-stelle"][0], allCombo.length)
                    break;
                case 4:
                    result["4-stelle"][0] += 1
                    result["4-stelle"][1] = calcPerc(result["4-stelle"][0], allCombo.length)
                    break;
                case 5:
                    result["5-stelle"][0] += 1
                    result["5-stelle"][1] = calcPerc(result["5-stelle"][0], allCombo.length)
                    break;
                case 6:
                    result["6-stelle"][0] += 1
                    result["6-stelle"][1] = calcPerc(result["6-stelle"][0], allCombo.length)
                    break;
            }
        })

    return Object.values(result)
}

const calcPerc = (num, tot) => {
    return (num / tot) * 100
}