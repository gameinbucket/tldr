calc.distribute = function(tokens, left, right)
{
    var operator = left === 0 ? calc.PLUS : tokens[left - 1].type;

    if (operator === calc.MULT)
    {
        var value = tokens[left - 2];

        if (value.type === calc.NUMBER)
        {
            for (var i = left + 1; i < right; i++)
                calc.multiply(tokens[i], value);

            tokens.splice(left - 1, 1);
            tokens.splice(left - 2, 1);

            return left - 3;
        }
        else if (value.type === calc.CLOSE_BRACKET)
        {
            var open = 0;
            var close = left - 2;
            var count = 1;

            for (var i = left - 3; i >= 0; i--)
            {
                var p = tokens[i];

                if (p.type === calc.CLOSE_BRACKET)
                    count++;
                else if (p.type === calc.OPEN_BRACKET)
                {
                    count--;

                    if (count === 0)
                    {
                        open = i;
                        break;
                    }
                }
            }

            var dist = [];

            for (var i = open + 1; i < close; i++)
            {
                var op1 = tokens[i];

                if (op1.type !== calc.NUMBER) continue;

                for (var j = left + 1; j < right; j++)
                {
                    var op2 = tokens[j];

                    if (op2.type !== calc.NUMBER) continue;

                    var op2exp = {};

                    for (var key in op2.exponent)
                        op2exp[key] = op2.exponent[key];

                    var copy = new number(op2.value, op2exp);
    
                    calc.multiply(copy, op1);

                    dist.push(copy);
                }
            }

            for (var i = right - 1; i > open; i--)
                tokens.splice(i, 1);

            for (var i = 0; i < dist.length; i++)
            {
                tokens.splice(open + 1 + i * 2, 0, dist[i]);

                if (i + 1 < dist.length)
                    tokens.splice(open + 2 + i * 2, 0, new token(calc.PLUS));
            }

            return open - 1;
        }
    }
    else if (operator === calc.DIVIDE)
    {
        var value = tokens[left - 2];

        if (value.type === calc.NUMBER)
        {
            for (var i = left + 1; i < right; i++)
                calc.divide(tokens[i], value);

            tokens.splice(left - 1, 1);
            tokens.splice(left - 2, 1);

            return left - 3;
        }
        else if (value.type === calc.CLOSE_BRACKET)
        {
            console.log('guh');
        }
    }
    else if (operator === calc.PLUS || operator === calc.OPEN_BRACKET)
    {
        if (right + 2 < tokens.length && tokens[right + 1].type === calc.MULT)
        {
            var value = tokens[right + 2];

            if (value.type === calc.OPEN_BRACKET) return right;
        }
        else
        {
            tokens.splice(right, 1);
            tokens.splice(left, 1);
        }

        return right - 2;
    }

    return right;
};
