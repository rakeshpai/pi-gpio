function parseOptions(string) {
    var options = { 'direction': 'out' };
    string.split(' ').filter(function noEmpties(t) {
        return t;
    }).forEach(function(option) {
        switch (option.toLowerCase()) {
            case 'in':
            case 'input':
                options.direction = 'in';
                break;
            case 'out':
            case 'output':
                options.direction = 'out';
                break;
            case 'up':
            case 'pullup':
                options.pull = 'up';
                break;
            case 'down':
            case 'pulldown':
                options.pull = 'down';
                break;
            case 'tri':
                options.pull = 'tri';
                break;
            default:
                throw new Error("Illegal option token!");
                break;
        }
    });
    return options;
}

function parseValue(value) {
    switch (value) {
        case true:
        case 1:
        case '1':
            return '1';
            break;
        case false:
        case 0:
        case '0':
            return '0';
            break;
        default:
            throw new Error('Illegal on/off value');
            break;
    }
}

exports.parseOptions = parseOptions;
exports.parseValue   = parseValue;
exports.parseDirection = function(dir) { return parseOptions(dir).direction; };
