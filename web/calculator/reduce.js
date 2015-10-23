calc.reduce = function(tokens, left, right)
{
    for (var i = left; i < right; i++) if (tokens[i].type === calc.POWER)
    {
        if (i === 0 || i + 1 === tokens.length)
        {
            tokens.splice(i, 1);
            i--;
            right--;
            continue;
        }

        if (calc.pow(tokens[i - 1], tokens[i + 1]))

        return right;
        {
            tokens.splice(i, 2);
            i--;
            right -= 2;
        }
    }

    for (var i = left; i < right; i++) if (tokens[i].type === calc.MULT || tokens[i].type === calc.DIVIDE)
    {
        if (i === 0 || i + 1 === tokens.length)
        {
            tokens.splice(i, 1);
            i--;
            right--;
            continue;
        }
        
        var res = tokens[i].type === calc.MULT ? calc.multiply(tokens[i - 1], tokens[i + 1]) : calc.divide(tokens[i - 1], tokens[i + 1]);

        if (res)
        {
            tokens.splice(i, 2);
            i--;
            right -= 2;
        }
    }

    for (var i = left; i < right; i++) if (tokens[i].type === calc.PLUS)
    {
        if (i === 0 || i + 1 >= tokens.length)
        {
            tokens.splice(i, 1);
            i--;
            right--;
            continue;
        }

        if (tokens[i + 1].greater(tokens[i - 1]))
        {
            var temp = tokens[i - 1];

            tokens[i - 1] = tokens[i + 1];
            tokens[i + 1] = temp;

            i = Math.max(-1, i - 3);
        }
    }

    for (var i = left; i < right; i++) if (tokens[i].type === calc.PLUS)
    {
        if (calc.addition(tokens[i - 1], tokens[i + 1]))
        {
            tokens.splice(i, 2);
            i--;
            right -= 2;
        }
    }

    return right;
};
