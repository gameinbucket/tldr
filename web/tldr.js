function js(src)
{
    var script = document.createElement('script');
    
    script.src = src + '.js';
    script.async = false;
    
    document.head.appendChild(script);
}

js('calculator/calculator');
js('chem');
js('panel');

window.onload = function()
{
    var display = document.getElementsByTagName('main')[0];
    var search = document.getElementById('search');
    var go = document.getElementById('go');
    var settings = document.getElementById('settings');
    var background = localStorage.getItem('main-background-image');

    search.addEventListener('keydown', key_search);
    go.addEventListener('mousedown', mouse_go);
    settings.addEventListener('mousedown', mouse_settings);

    document.addEventListener('mousedown', mousedown);
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    document.addEventListener('contextmenu', context);

    if (background)
    {
        display.style.backgroundRepeat = 'no-repeat';
        // display.style.backgroundRepeat = 'repeat';
        display.style.backgroundPosition = 'center center';
        // display.style.backgroundPosition = 'top left';
        display.style.backgroundSize = 'auto';
        // display.style.backgroundSize = 'cover';
        // display.style.backgroundSize = 'contain';
        display.style.backgroundImage = 'url(' + background + ')';

        display.style.backgroundColor = 'rgb(255, 255, 255)';
    }

    // localStorage.clear();

    var id = 0;
    while (true)
    {
        var title = localStorage.getItem('panel[' + id + ']');

        if (title)
        {
            localStorage.removeItem('panel[' + id + ']');
            solve(title);
        }
        else break;

        id++;
    }
}

window.onunload = function()
{
    for (var i = 0; i < panels.list.length; i++)
        localStorage.setItem('panel[' + i + ']', panels.list[i].plain);
}

function mousedown(e)
{
    panels.down(e.clientX, e.clientY);
}

function mousemove(e)
{
    panels.move(e.clientX, e.clientY);
}

function mouseup(e)
{
    panels.up();
}

function context(e)
{
    if (panels.context(e.clientX, e.clientY))
        e.preventDefault();
}

function mouse_go(e)
{
    question();
}

function key_search(e)
{
    if (e.keyCode === 13)
    {
        question();
        return false;
    }
}

function mouse_settings(e)
{
    var image_upload = document.createElement('input');

    image_upload.id = 'background-image-upload';
    image_upload.type = 'file';
    image_upload.accept = 'image/*';

    image_upload.addEventListener('change', picture_uploaded);

    // panels.make(document.getElementsByTagName('main')[0], 'Settings', image_upload);

    document.body.appendChild(image_upload);
}

function picture_uploaded(e)
{
    var reader = new FileReader();

    reader.onload = function(e)
    {
        var display = document.getElementsByTagName('main')[0];

        display.style.backgroundRepeat = 'no-repeat';
        display.style.backgroundPosition = 'center center';
        display.style.backgroundImage = 'url(' + e.target.result + ')';

        localStorage.setItem('main-background-image', e.target.result);
    }
    
    reader.readAsDataURL(e.target.files[0]);

    document.body.removeChild(document.getElementById('background-image-upload'));
}

function question()
{
    var input = document.getElementsByTagName('input')[0];
    var solution = analyze(input.value);

    if (!solution) return;

    var display = document.getElementsByTagName('main')[0];

    panels.make(display, solution.header, solution.main, solution.plain);
    input.blur();
}

function solve(input)
{
    var solution = analyze(input);

    if (!solution) return;

    var display = document.getElementsByTagName('main')[0];

    panels.make(display, solution.header, solution.main, solution.plain);
}

function analyze(input)
{
    var out;

    out = calc.solve(input);
    if (out) return out;

    out = chem.solve(input);
    if (out) return out;

    // context menu
    // copy title
    // copy content
    // save
    // close

    // calculated
    // time [location] [location]
    // analog clock time
    // digital clock time
    // time zone [location]
    // measurements [value] [type] [value] [type]
    // arithmetic
    // algebra
    // calculus
    // atomic mass [molecule]
    // chem[istry] equation balance
    // b[ase] 2 (binary) , base 8 (octal), base 10 (decimal), base 16 (hex), base 64 conversion
    // boolean algebra simplify / truth table 
    
    // database
    // news [date]
    // english grammar words
    // chemistry equations
    // physics equations
    // list of acids and bases [molecule]
    // weather [location] [day]
    // history
    // music player <audio>
    // cooking times and instructions
    
    return null;
}
