calc.balance = function(tokens)
{
    if (tokens.length < 2) return;

    var left = tokens[0];
    var right = tokens[1];

    for (var i = 0; i < left.length; i++)
    {
        var tok = left[i];

        if (tok.type !== calc.NUMBER) continue;
        if (tok.exponent !== null) continue;
        
        var pre = i > 0 ? left[i - 1] : null;
        var nex = i + 1 < left.length ? left[i + 1] : null;

        if (pre != null && pre.type !== calc.PLUS) continue;
        if (nex != null && nex.type !== calc.PLUS) continue;

        tok.value *= -1;

        if (pre !== null) left.splice(i--, 1);

        if (right && right.length > 0) right.push(new token(calc.PLUS));

        if (left.length === 0)
        {
            left.push(new number(0));
            i++;
        }
    }

    for (var i = 0; i < right.length; i++)
    {
        var tok = right[i];

        if (tok.type !== calc.NUMBER) continue;
        if (tok.exponent === null) continue;

        var pre = i > 0 ? right[i - 1] : null;
        var nex = i + 1 < right.length ? right[i + 1] : null;

        if (pre != null && pre.type !== calc.PLUS) continue;
        if (nex != null && nex.type !== calc.PLUS) continue;

        tok.value *= -1;

        right.splice(i--, 1);

        if (pre !== null) right.splice(i--, 1);

        if (left && left.length > 0) left.push(new token(calc.PLUS));

        left.push(tok);
    }

    var first = left[0];

    if (first.type === calc.NUMBER && first.value < 0)
    {
        for (var i = 0; i < tokens.length; i++)
            for (var j = 0; j < tokens[i].length; j++)
                if (tokens[i][j].type === calc.NUMBER) tokens[i][j].value *= -1;
    }

    calc.reduce(left, 0, left.length);
    calc.reduce(right, 0, right.length);
};
