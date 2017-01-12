calc.process = function(tokens)
{
    for (var i = 0; i < tokens.length; i++)
    {
        var side = tokens[i];

        for (var j = 0; j < side.length; j++)
        {
            var tok = side[j];
            
            if (tok.type === calc.DIVIDE)
            {
                if (j === 0 || j + 1 >= side.length) continue;

                var p = side[j - 1];
                var n = side[j + 1];

                var numer = p;
                var denom = n;

                side.splice(j + 1, 1);
                side.splice(j, 1);
                side.splice(j - 1, 1);
                side.splice(j, 0, new fraction(numer, denom));
            }
            else if (tok.type === calc.NUMBER)
            {
                if (j === 0) continue;

                var p = side[j - 1];

                if (p.type == calc.MINUS)
                {
                    tok.value *= -1;
                    p.type = calc.PLUS;
                    j -= 2;
                }
                else if (p.type === calc.CLOSE_BRACKET || (p.type === calc.MULT && side[j - 2].type == calc.CLOSE_BRACKET))
                {
                    var count = 0;

                    for (var m = j; m >= 0; m--)
                    {
                        var l = side[m];

                        if (l.type === calc.CLOSE_BRACKET) count++;
                        else if (l.type === calc.OPEN_BRACKET)
                        {
                            if (--count === 0)
                            {
                                side.splice(j, 1);
                                if (p.type === calc.MULT) side.splice(j - 1, 1);

                                side.splice(m, 0, new token(calc.MULT));
                                side.splice(m, 0, tok);

                                j = m - 1;

                                break;
                            }
                        }
                    }
                }
            }
            else if (tok.type === calc.OPEN_BRACKET)
            {
                if (j === 0) continue;
                    
                var p = side[j - 1];
                    
                if (p.type === calc.MINUS)
                {
                    side.splice(j, 0, new number(-1, null));
                    p.type = calc.PLUS;
                    j -= 2;
                }
                else if (p.type === calc.NUMBER) side.splice(j, 0, new token(calc.MULT));
                else if (p.type === calc.CLOSE_BRACKET) side.splice(j, 0, new token(calc.MULT));
            }
        }
    }
};
