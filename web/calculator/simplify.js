calc.simplify = function(tokens)
{
    for (var i = 0; i < tokens.length; i++)
    {
        var side = tokens[i];
        var left = 0;

        for (var j = 0; j < side.length; j++)
        {
            var t = side[j];

            if (t.type === calc.OPEN_BRACKET) left = j;
            else if (t.type === calc.CLOSE_BRACKET)
            {
                j = calc.reduce(side, left + 1, j);
                j = calc.distribute(side, left, j);
            }
        }

        calc.reduce(side, 0, side.length);
    }
}; 
