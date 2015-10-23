var calc = new Object();

calc.OPEN_BRACKET = 0;
calc.CLOSE_BRACKET = 1;
calc.PLUS = 2;
calc.MINUS = 3;
calc.MULT = 4;
calc.DIVIDE = 5;
calc.POWER = 6;
calc.NUMBER = 7;
calc.FRAC = 8;

js('calculator/tokenize');
js('calculator/process');
js('calculator/simplify');
js('calculator/reduce');
js('calculator/distribute');
js('calculator/balance');

calc.solve = function(input)
{
    var tokens = calc.tokenize(input);
    
    if (!tokens) return {header:input, main:'Error tokenizing'};

    var head = calc.print(tokens);

    calc.process(tokens);
    calc.simplify(tokens);
    calc.balance(tokens);
    
    return {header:head, main:calc.print(tokens), plain:input};
};

calc.pow = function(a, b)
{
    return false;
};

calc.multiply = function(a, b)
{
    if (a.type === calc.NUMBER && b.type === calc.NUMBER)
    {
        a.value *= b.value;

        if (a.value === 0)
        {
            a.exponent = null;
        }
        else if (b.exponent !== null)
        {
            if (a.exponent !== null)
            {
                for (var key in a.exponent)
                {
                    if (b.exponent[key]) a.exponent[key] += b.exponent[key];
                }

                for (var key in b.exponent)
                {
                    if (!a.exponent[key]) a.exponent[key] = b.exponent[key];
                }
            }
            else a.exponent = b.exponent;
        }

        return true;
    }

    return false;
};

calc.divide = function(a, b)
{
    if (a.type === calc.NUMBER && b.type === calc.NUMBER)
    {
        if (a.value === 0 || b.value === 0)
        {
            a.value = 0;
            a.exponent = null;

            return true;
        }

        if (b.exponent !== null)
        {
            if (a.exponent === null) a.exponent = {};

            for (var key in b.exponent)
            {
                if (a.exponent[key]) a.exponent[key] -= b.exponent[key];
                else a.exponent[key] = -b.exponent[key];

                if (a.exponent[key] === 0) delete a.exponent[key];
            }
        }

        if (a.value % b.value === 0)
        {
            a.value /= b.value;
            return true;
        }
        else
        {
            var g = calc.gcd(a.value, b.value);

            a.value /= g;
            b.value /= g;

            return false;
        }
    }

    return false;
};

calc.addition = function(a, b)
{
    if (a.type === calc.NUMBER && b.type === calc.NUMBER)
    {
        if (a.equivalent(b))
        {
            a.value += b.value;

            if (a.value === 0) a.exponent = null;

            return true;
        }
    }

    return false;
};

calc.debug = function(tokens)
{
    var temp = '<math>';
    for (var i = 0; i < tokens.length; i++)
        temp += calc.print_tok(tokens[i]) + ' ';
    document.body.innerHTML += temp + '</math>';
};

calc.print = function(tokens)
{
    if (!tokens) return '';
    
    var out = '<math><mrow>';

    for (var i = 0; i < tokens.length; i++)
    {
        for (var j = 0; j < tokens[i].length; j++)
        {
            var p = calc.print_tok(tokens[i][j]);
            
            if (p === '') return 'Error printing';

            out += p + ' ';
        }

        if (i + 1 < tokens.length) out += '<mo>=</mo> ';
    }

    out += '</mrow></math>';

    return out;
};

calc.print_tok = function(tok)
{
    if      (tok.type === calc.NUMBER)        return tok.print();
    else if (tok.type === calc.FRAC)          return tok.print();
    else if (tok.type === calc.PLUS)          return '<mo>&plus;</mo>';
    else if (tok.type === calc.MINUS)         return '<mo>&minus;</mo>';
    else if (tok.type === calc.MULT)          return '<mo>&times;</mo>';
    else if (tok.type === calc.DIVIDE)        return '<mo>&divide;</mo>';
    else if (tok.type === calc.POWER)         return '<mo>^</mo>';
    else if (tok.type === calc.OPEN_BRACKET)  return '<mfenced><mrow>';
    else if (tok.type === calc.CLOSE_BRACKET) return '</mrow></mfenced>';
    else return '';
};

calc.isdigit = function(c)
{
    if (c == ' ') return false;
    return !isNaN(Number(c));
};

calc.isletter = function(c)
{
    return c.match(/[a-z]/i);
};

calc.gcd = function(a, b)
{
    while (a !== 0 && b !== 0)
    {
        var temp = b;

        b = a % b;
        a = temp;
    }

    return a + b;
};

function token(type)
{
    this.type = type;
}

function number(value, exponent)
{
    this.type = calc.NUMBER;
    this.value = value;
    this.exponent = exponent;
}

number.prototype.print = function()
{
    var out = '';

    if (this.exponent)
    {
        if (this.value != 1)
        {
            out += '<mn>' + this.value + '</mn>';
        }

        for (var key in this.exponent)
        {
            if (this.exponent[key] == 1)
            {
                out += '<mi>' + key + '</mi>';
            }
            else
            {
                out += '<msup><mi>' + key + '</mi><mn>' + this.exponent[key] + '</mn></msup>';
            }
        }
    }
    else out += this.value;

    return out;
};

number.prototype.degree = function()
{
    var sum = 0;

    if (this.exponent) for (var key in this.exponent) sum += this.exponent[key];

    return sum;
};

number.prototype.hash = function()
{
    var text = '';

    for (var key in this.exponent) text += key + this.exponent[key];

    var h = 0;

    for (var i = 0; i < text.length; i++)
    {
        var c = text[i];

        h = ((h << 5) - h) + c;
        h |= 0;
    }

    return h;
};

number.prototype.greater = function(next)
{
    var n = this.degree();
    var m = next.degree();

    if (n > m) return true;

    if (n === m)
    {
        if (n === 0) return this.value > next.value;

        n = this.exponent.length;
        m = next.exponent.length;

        if (n < m) return true;

        if (n === m) return this.hash() < next.hash();
    }

    return false;
};

number.prototype.equivalent = function(next)
{
    if (!this.exponent && !next.exponent) return true;
    if (!this.exponent || !next.exponent) return false;
    if (Object.keys(this.exponent).length !== Object.keys(next.exponent).length) return false;

    for (var key in this.exponent)
    {
        if (!next.exponent[key]) return false;
        if (this.exponent[key] !== next.exponent[key]) return false;
    }
    
    return true;
};

function fraction(numerator, denominator)
{
    this.type = calc.FRAC;
    this.numerator = numerator;
    this.denominator = denominator;
}

fraction.prototype.print = function()
{
    var out = '<mfrac><mrow>';

    out += this.numerator.print();

    out += '</mrow><mrow>';

    out += this.denominator.print();

    out += '</mrow></mfrac>';

    return out;
};
