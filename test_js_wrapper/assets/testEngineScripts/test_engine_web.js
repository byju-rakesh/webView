if (typeof already_included_env !== 'undefined') {
    fatalError('You have multiple env enabled');
}

already_included_env = true;
console.log('NOTE: you are using the web version of test module');

(function() {
    var _questionData = {};
    var debug_images = true;

    function _prepareQuestionData(filename) {
        $.holdReady(true);
        $.getJSON(filename, function(json) {
            _questionData = $.map(json.questions, function(q) {
                var qtitle = q.title || 'No Question Found',
                    qSolution = q.solution || 'No Solution Found';

                if (debug_images) {
                    qtitle = qtitle.replace(/tnl:\/\//gi, 'test_data/');
                    qSolution = qSolution.replace(/tnl:\/\//gi, 'test_data/');
                }

                var r = {
                    id: q.id,
                    type: q.type,
                    title: qtitle,
                    answers: q.answers,
                    tags: ['easy', 'memory'],
                    mode: isQuestionMode ? 'question' : 'solution',
                    solution: (q.solution || '').replace(/tnl:\/\//gi, 'test_data/')
                };

                var atLeastOne = false;
                if ($.inArray(r.type, ['MultipleChoiceQuestion', 'MultiSelectQuestion']) >= 0) {
                    $.each(r.answers, function(idx, v) {
                        if (!isQuestionMode) {
                            v.is_selected = (r.type == 'MultiSelectQuestion' || !atLeastOne) && (Math.random() > 0.66);
                            atLeastOne = atLeastOne || v.is_selected;
                        }
                        if (debug_images) {
                            v.title = (v.title || '').replace(/tnl:\/\//gi, 'test_data/');
                        }
                    });
                }

                if (r.type == 'FillInTheBlankQuestion') {
                    var ids = [];
                    $('<p>' + q.title + '</p>').find('tnl-filler').each(function(i, elem){
                        ids.push(parseInt($(this).attr('answer_ids').split(',')[0]));
                    });
                    r.answers = $.grep(r.answers, function(e) {
                        return $.inArray(e.id, ids) >= 0;
                    });
                }

                return r;
            }).reduce(function(result, q) {
                result[q.id] = q;
                return result;
            }, {});
            $.holdReady(false);
        });
    }

    var qNo = 1;
    window._getQuestionData = function(questionID, callback) {
        $(document).ready(function() {
            var questionIDs = Object.keys(_questionData);
            if (questionID < 0) questionID = questionIDs[Math.floor(Math.random() * questionIDs.length)];
            var questionData = _questionData[questionID];
            questionData['q_num'] = qNo++;
            callback(questionData);
        });
    }

    _prepareQuestionData('test_data/sample_test.json');
})();

var questionProvider = qp = (function() {

    return {
        imageClicked: function(src, zoomLevel) {
            alert("image was clicked: " + src + 'at zoom' + zoomLevel);
        },

        solutionClicked: function(questionID) {
            alert("Solution for " + questionID);
        },

        getQuestionData: _getQuestionData
    };
})();

function getQueryParams(qs) {
    qs = (qs || '').split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}


/*
function getWebQuestionProvider(){
    return {
        getQuestionData: function(questionID) {
            return [{
                type: 'MultiSelectQuestion', //TODO: change
                title: '<p>What is a question</p><p>This is paragraph 2</p><img src="https://www.gravatar.com/avatar/fdad68171e20ea5492b0883169ac0cc7?s=328&d=identicon&r=PG">',
                answers: [
                    { id: 1, title: 'one', is_correct: false, is_selected: true },
                    { id: 2, title: 'Two', is_correct: true, is_selected: false },
                    { id: 3, title: 'Three is a very long sentence which will flow to the next line', is_correct: false, is_selected: true },
                    { id: 4, title: 'Four', is_correct: false, is_selected: false },
                ],
                tags: [ 'Easy', 'Memory'],
                mode: 'question',
                solution: 'This is an answer'
            },{
                type: 'MultipleChoiceQuestion', //TODO: change
                title: '<p>What is a question</p><p>This is paragraph 2</p>',
                answers: [
                    { id: 1, title: 'one', is_correct: false, is_selected: false },
                    { id: 2, title: 'Two', is_correct: true, is_selected: true },
                    { id: 3, title: 'Three is a very long sentence which will flow to the next line', is_correct: false, is_selected: false },
                    { id: 4, title: 'Four', is_correct: false, is_selected: false },
                ],
                tags: [ 'Easy', 'Memory'],
                mode: 'question',
                solution: 'This is an answer'
            },{
                type: 'MultiSelectQuestion', //TODO: change
                title: '<p>What is a question</p><p>This is paragraph 2</p>',
                answers: [
                    { id: 1, title: 'one', is_correct: false, is_selected: true },
                    { id: 2, title: 'Two', is_correct: true, is_selected: true },
                    { id: 3, title: 'Three is a very long sentence which will flow to the next line', is_correct: true, is_selected: false },
                    { id: 4, title: 'Four', is_correct: false, is_selected: false },
                ],
                tags: [ 'Easy', 'Memory'],
                mode: 'solution',
                solution: 'This is an answer'
            }, {
                type: 'MultipleChoiceQuestion', //TODO: change
                title: '<p>What is a question</p><p>This is paragraph 2</p>',
                answers: [
                    { id: 1, title: 'one', is_correct: false, is_selected: true },
                    { id: 2, title: 'Two', is_correct: true, is_selected: true },
                    { id: 3, title: 'Three is a very long sentence which will flow to the next line', is_correct: false, is_selected: false },
                    { id: 4, title: 'Four', is_correct: false, is_selected: false },
                ],
                tags: [ 'Easy', 'Memory'],
                mode: 'solution',
                solution: 'This is an answer'
            }, {
                type: 'FillInTheBlankQuestion', //TODO: change
                title: '<p>Filler What is a <tnl-filler size="4" type="numeric"></tnl-filler> question</p><p>This is <tnl-filler size="10" type="text"></tnl-filler> paragraph 2</p>',
                answers: [
                    { user_answer: '', is_correct: true },
                    { user_answer: 'o', is_correct: false }
                ],
                tags: [ 'Easy', 'Memory'],
                mode: 'question',
                solution: '1.4,do'
            },{
                type: 'FillInTheBlankQuestion', //TODO: change
                title: '<p>Filler What is a <tnl-filler size="4" type="numeric"></tnl-filler> question</p><p>This is <tnl-filler size="10" type="text"></tnl-filler> paragraph 2</p>',
                answers: [
                    { user_answer: '1.4', is_correct: true, title: '1.4' },
                    { user_answer: 'two', is_correct: false, title: 'randu' }
                ],
                tags: [ 'Easy', 'Memory'],
                mode: 'solution',
                solution: 'This is a big one. This explains what is the solution and how we arrive at it. it may or mmaynot coontain anything else.'
            }][questionID];
        },
        imageClicked: function(src) {
            alert("image was clicked: " + src);
        }
    };
};
*/
