var panels = new Object();

panels.list = [];

panels.margin = 5;
panels.left = false;
panels.right = false;
panels.upper = false;
panels.lower = false;
panels.moving = false;

panels.active = null;
panels.x = 0;
panels.y = 0;
panels.w = 0;
panels.h = 0;

panels.make = function(display, title, content, plain)
{
    var b = display.getBoundingClientRect();

    var p = document.createElement('article');
    var t = document.createElement('h1');
    var c = document.createElement('div');
    var f = document.createElement('p');

    p.style.top = ((b.top + b.height) / 2 - 50) + 'px';
    p.style.left = ((b.left + b.width) / 2 - 75) + 'px';
    p.style.width = '150px';
    p.style.height = '100px';

    t.innerHTML = title;

    if (typeof content === 'string') f.innerHTML = content;
    else f.appendChild(content);

    p.appendChild(t);
    p.appendChild(c);
    c.appendChild(f);

    p.plain = plain;

    panels.list.splice(0, 0, p);

    display.appendChild(p);
};

panels.isInside = function(x, y, rect)
{
    if (x < rect.left               - panels.margin) return false;
    if (x > rect.left + rect.width  + panels.margin) return false;
    if (y < rect.top                - panels.margin) return false;
    if (y > rect.top  + rect.height + panels.margin) return false;
    return true;
};

panels.onLeft = function(x, y, rect)
{
    if (x < rect.left              - panels.margin) return false;
    if (x > rect.left              + panels.margin) return false;
    if (y < rect.top               - panels.margin) return false;
    if (y > rect.top + rect.height + panels.margin) return false;
    return true;
};

panels.onRight = function(x, y, rect)
{
    if (x < rect.left + rect.width - panels.margin) return false;
    if (x > rect.left + rect.width + panels.margin) return false;
    if (y < rect.top               - panels.margin) return false;
    if (y > rect.top + rect.height + panels.margin) return false;
    return true;
};

panels.onTop = function(x, y, rect)
{
    if (x < rect.left              - panels.margin) return false;
    if (x > rect.left + rect.width + panels.margin) return false;
    if (y < rect.top               - panels.margin) return false;
    if (y > rect.top               + panels.margin) return false;
    return true;
};

panels.onBot = function(x, y, rect)
{
    if (x < rect.left              - panels.margin) return false;
    if (x > rect.left + rect.width + panels.margin) return false;
    if (y < rect.top + rect.height - panels.margin) return false;
    if (y > rect.top + rect.height + panels.margin) return false;
    return true;
};

panels.find = function(x, y)
{
    for (var i = 0; i < panels.list.length; i++)
    {
        var p = panels.list[i];
        var r = p.getBoundingClientRect();

        if (panels.isInside(x, y, r)) return p;
    }
    return null;
};

panels.cursor = function(x, y)
{
    if (panels.active === null)
    {
        document.body.style.cursor = 'default';
        return;
    }

    var r = panels.active.getBoundingClientRect();
    var t = panels.onTop(x, y, r);
    var b = panels.onBot(x, y, r);

    if (panels.onLeft(x, y, r))
    {
        if (t) document.body.style.cursor = 'nwse-resize';
        else if (b) document.body.style.cursor = 'nesw-resize';
        else document.body.style.cursor = 'ew-resize';
    }
    else if (panels.onRight(x, y, r))
    {
        if (t) document.body.style.cursor = 'nesw-resize';
        else if (b) document.body.style.cursor = 'nwse-resize';
        else document.body.style.cursor = 'ew-resize';
    }
    else if (t || b) document.body.style.cursor = 'ns-resize';
    else document.body.style.cursor = 'move';
};

panels.down = function(x, y)
{
    if (panels.active === null) return;

    var r = panels.active.getBoundingClientRect();
    var t = panels.onTop(x, y, r);
    var b = panels.onBot(x, y, r);

    if (panels.onLeft(x, y, r))
    {
        if (t)
        {
            panels.upper = true;
            panels.y = r.top - y;
            panels.h = r.top + r.height;
        }
        else if (b)
        {
            panels.lower = true;
            panels.y = r.height - y;
        }
        panels.left = true;
        panels.x = r.left - x;
        panels.w = r.left + r.width;
    }
    else if (panels.onRight(x, y, r))
    {
        if (t)
        {
            panels.upper = true;
            panels.y = r.top - y;
            panels.h = r.top + r.height;
        }
        else if (b)
        {
            panels.lower = true;
            panels.y = r.height - y;
        }
        panels.right = true;
        panels.x = r.width - x;
    }
    else if (t)
    {
        panels.upper = true;
        panels.y = r.top - y;
        panels.h = r.top + r.height;
    }
    else if (b)
    {
        panels.lower = true;
        panels.y = r.height - y;
    }
    else
    {
        panels.moving = true;

        panels.x = r.left - x;
        panels.y = r.top - y;

        panels.list.splice(panels.list.indexOf(panels.active), 1);
        panels.list.splice(0, 0, panels.active);

        var display = panels.active.parentElement;

        display.removeChild(panels.active);
        display.appendChild(panels.active);
    }
};

panels.move = function(x, y)
{
    if (panels.left)
    {
        var rect = panels.active.getBoundingClientRect();
        var bounds = panels.active.parentElement.getBoundingClientRect();
        var o = rect.left;
        x = panels.x + x;
        if (x < bounds.left) x = bounds.left;

        panels.active.style.width = (panels.w - x) + 'px';

        var lim = panels.active.getElementsByTagName('h1')[0].getBoundingClientRect();
        x = panels.w - lim.width;
        
        panels.active.style.left = x + 'px';
        panels.active.style.width = (panels.w - x) + 'px';
    }
    if (panels.right)
    {
        var rect = panels.active.getBoundingClientRect();
        var bounds = panels.active.parentElement.getBoundingClientRect();
        x = panels.x + x;
        if (rect.left + x > bounds.left + bounds.width) x = bounds.left + bounds.width - rect.left - x;
        panels.active.style.width = x + 'px';
    }
    if (panels.upper)
    {
        var rect = panels.active.getBoundingClientRect();
        var bounds = panels.active.parentElement.getBoundingClientRect();
        var o = rect.top;
        y = panels.y + y;
        if (y < bounds.top) y = bounds.top;

        panels.active.style.height = (panels.h - y) + 'px';

        var lim = panels.active.getElementsByTagName('h1')[0].getBoundingClientRect();
        var lim2 = panels.active.getElementsByTagName('p')[0].getBoundingClientRect();
        y = panels.h - lim.height - lim2.height;

        panels.active.style.top = y + 'px';
        panels.active.style.height = (panels.h - y) + 'px';
    }
    if (panels.lower)
    {
        var rect = panels.active.getBoundingClientRect();
        var bounds = panels.active.parentElement.getBoundingClientRect();
        y = panels.y + y;
        if (rect.top + y > bounds.top + bounds.height) y = bounds.top + bounds.height - rect.top - y;
        panels.active.style.height = y + 'px';
    }
    if (panels.left || panels.right || panels.upper || panels.lower) return;
    if (panels.moving)
    {
        var rect = panels.active.getBoundingClientRect();
        var bounds = panels.active.parentElement.getBoundingClientRect();
        x = panels.x + x;
        y = panels.y + y;
        if (x < bounds.left) x = bounds.left;
        else if (x + rect.width > bounds.left + bounds.width) x = bounds.left + bounds.width - rect.width;
        if (y < bounds.top) y = bounds.top;
        else if (y + rect.height > bounds.top + bounds.height) y = bounds.top + bounds.height - rect.height;
        panels.active.style.left = x + 'px';
        panels.active.style.top = y + 'px';
        return;
    }

    panels.active = panels.find(x, y);
    panels.cursor(x, y);
};

panels.up = function()
{
    panels.left = false;
    panels.right = false;
    panels.upper = false;
    panels.lower = false;
    panels.moving = false;
};

panels.context = function(x, y)
{
    if (panels.active)
    {
        panels.list.splice(panels.list.indexOf(panels.active), 1);

        var display = panels.active.parentElement;
        display.removeChild(panels.active);

        return true;
    }

    return false;
};
