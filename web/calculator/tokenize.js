calc.tokenize = function(input)
{
    var tokens = [];

    var side = 0;

    tokens[side] = [];

    for (var i = 0; i < input.length; i++)
    {
        var c = input[i];

        if      (c === '(') tokens[side].push(new token(calc.OPEN_BRACKET));
        else if (c === ')') tokens[side].push(new token(calc.CLOSE_BRACKET));
        else if (c === '=') tokens[++side] = [];
        else if (c === '+') tokens[side].push(new token(calc.PLUS));
        else if (c === '-') tokens[side].push(new token(calc.MINUS));
        else if (c === '*') tokens[side].push(new token(calc.MULT));
        else if (c === '/') tokens[side].push(new token(calc.DIVIDE));
        else if (c === '^') tokens[side].push(new token(calc.POWER));
        else if (calc.isdigit(c) || calc.isletter(c) || c === '.')
        {
            var val;
            var is_real;

            if (c === '.')
            {
                is_real = true;
                val = '.';
                i++;
            }
            else
            {
                is_real = false;
                val = '';
            }

            while (i < input.length && calc.isdigit(input[i])) val += input[i++];

            if (i < input.length && input[i] === '.')
            {
                if (is_real) return null;
                else
                {
                    val += '.';
                    i++;

                    while (i < input.length && calc.isdigit(input[i])) val += input[i++];
                }
            }

            if (i < input.length && input[i] === '.') return null;

            var num = val === '' ? 1 : Number(val);

            var name;
            var exp = null;

            while (i < input.length && calc.isletter(input[i]))
            {
                c = input[i++];

                if (!exp) exp = {};

                if (c === 'p' && i < input.length && input[i] === 'i')
                {
                    name = '&#x03C0;';
                    i++;
                }
                else name = c;
            
                if (i < input.length && input[i] === '^') i++;

                val = '';

                while (i < input.length && calc.isdigit(input[i])) val += input[i++];

                
                var pow = val === '' ? 1 : Number(val);

                if (exp[name]) exp[name] += pow;
                else exp[name] = pow;
            }

            if (i < input.length && input[i] === '.') return null;

            tokens[side].push(new number(num, exp));
            i--;
        }
        else if (c !== ' ') return null;
    }

    return tokens;
};
