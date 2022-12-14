const makeSelect = async (cols, table, attrs) => {
    let qry = '';

    for(const key in attrs){
        if (attrs[key][2] === 1 && cols.includes(attrs[key][1])) {
            qry += `\t${table}.${attrs[key][0]} AS "${attrs[key][1]}",\n`;
        }
    }

    qry = qry.slice(0, -2) + '\n';
    return qry;
}

const makeWhere = async (where, table, attrs) => {
    let qry = ' ';

    for(const key in attrs){
        if ( where.includes(attrs[key][1]) ) {
            qry += `UPPER(${table}.${attrs[key][0]}) LIKE UPPER(:value) OR\n`;
        }
    }

    qry = qry.slice(0, -3) + '\n';
    return qry;
}

module.exports = {
	makeSelect,
	makeWhere
}