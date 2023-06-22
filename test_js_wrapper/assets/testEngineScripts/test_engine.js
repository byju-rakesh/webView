var testModule = (function(){

    var answerChangedNotifier = {
        _lastAnswerStatus: false,
        _getFillerStatus: function() {
            var allInputs = $('#q .question-text tnl-filler input');
            var filledInputs = $.grep(allInputs, function(input) {
                return input.value.trim().length > 0;
            });
            return allInputs.length == filledInputs.length;
        },
        _getMCQStatus: function() {
            return $('#q ul.opts-list li.selected').length > 0;
        },
        _getStatus: function(questionType) {
            var status = false;
            switch (questionType) {
                case 'FillInTheBlankQuestion':
                    status = this._getFillerStatus();
                    break;
                case 'MultiSelectQuestion':
                case 'MultipleChoiceQuestion':
                    status = this._getMCQStatus();
                    break;
                default:
                    break;
            }
            return status;
        },
        initializeStatus: function(questionType) {
            this._lastAnswerStatus = this._getStatus(questionType);
        },
        notifyIfAnswerStatusChanged: function(questionType) {
            var currentStatus = this._getStatus(questionType);
            if (this._lastAnswerStatus != currentStatus) {
                this._lastAnswerStatus = currentStatus;
                qp.notifyAnswerStatusChanged(this._lastAnswerStatus);
            }
        }
    }

    function getEMHeight() {
        return parseFloat($("body").css("font-size"));
    }

    function fixMiddleAlignForImage() {
        var img = $(this)
            .removeAttr('height')
            .css({visibility: 'hidden'}) /* wait for it to render, find height and apply relevant classes */
            .load(function() {
                if (img.height() > 2.5 * getEMHeight()) {
                    img.addClass('middle-align');
                }
                img.css({visibility: ''});
            });
    }

    function scrollMathJax() {
        $(this).css({
                      '-webkit-overflow-scrolling': 'touch',
                      'position': 'relative',
                      'max-width': '100vw',
                      'min-width': '1vw',
                      'overflow-y' : 'visible',
                      'overflow-x': 'auto'
                    });
    }
    function _renderQuestion(containers, q, altSolutionView) {

        if (containers['tc'] && isSolutionMode) {
            _renderSkills(containers['tc'], q);
        }

        if (q['passage'] && containers['pc']) {
            var pc = $(containers['pc'])
                .find('.passage-text')
                    .html(q['passage'])
                .end()
                .find('.passage-toggle-btn')
                    .click(function() {
                        $(this).parent().toggleClass('expanded-passage');
                    })
                .end()
                .show();
        }

        if (containers['qc']) {
            var qc = $(containers['qc'])
                .hide()
                .html(q['title'] || 'Error Loading Question')
                  .find('img')
                    .each(fixMiddleAlignForImage)
                    .click(function() {
                        qp.imageClicked(this.src, (this.width * 1.3) / this.naturalWidth);
                    })
                  .end()
                  .find('.mjx-chtml')
                    .each(scrollMathJax)
                  .end()
                .show();
            if(q['isTopPaddingRequired']) {
              qc.addClass('question-text-top-padding')
            }

            if(q['isStyleCustomized']) {
                qc.addClass('custom-question-text')
            }
            if (q['type'] === 'FillInTheBlankQuestion') {
                _renderFiller(qc, q);
            }

            if (needsScrollPadding) {
                $('#q .scroll-padding').addClass('needs-scroll-padding');
            }
        }

        _renderOptions(containers['oc'], q);
        if (altSolutionView) {
            _renderSolutionAlt(containers['sc'], q);
        } else {
            _renderSolution(containers['sc'], q);
        }
    }

    function filterKeys(e) {
        var keyCode = e.which || e.keyCode;
        if (e.data.type === 'number') {
            if ((keyCode > 47 && keyCode < 58) ||
                ($.inArray(keyCode, [8, 9, 10, 13, 190, 189, 187]) > -1)) {
                return true;
            }
            e.preventDefault();
            return false;
        }
    }

    function isKeyAllowed(e) {
        var keyCode = e.which || e.keyCode;

        if ($.inArray(keyCode, [13, 9, 10]) >= 0) { // enter, tab, newline
            var self = $(this),
                allFillers = self.parentsUntil('.question-text ~ body', '.question-text')
                            .find('tnl-filler input'),
                myIdx = allFillers.index(self),
                next = allFillers.get(myIdx + 1);

            self.blur();
            if (next) {
                next.focus();
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
        return true;
    }

    function _getInputAttr(type) {
        var ret = {};
        switch (type) {
        case 'number':
        case 'integer':
            ret = { type: 'number', step: 0.01 };
            break;
        case 'text':
            ret = { type: 'text' };
            break;
        default:
        }
        return ret;
    }

    function _renderFiller(c, q) {
        var answers = q['answers'] || [];

        $('tnl-filler', c).each(function(idx) {
            var $f = $(this).empty(),
                sz = (parseInt($f.attr('size')) || 12) + 3,
                cls = 'filler',
                ans = answers[idx] || {};

            if (isSolutionMode) {
                cls += (ans['is_correct'] ? ' fill-correct' : ' fill-incorrect');
            }

            var typeAttr = {};

            $('<input autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">')
                .attr({
                    maxlength: sz,
                    size: sz,
                    disabled: isSolutionMode,
                    value: ans['user_answer'] || ''
                })
                .attr(_getInputAttr($f.attr('type')))
                .addClass(cls)
                .appendTo($f)
                .on('keyup', isKeyAllowed)
                .on('keydown', null, { type: $f.attr('type') },filterKeys)
                .on('focus', function() {
                    qp.scrollQuestionCard($(this).offset().top - 4 * getEMHeight());
                }).on('blur input', function() {
                    answerChangedNotifier.notifyIfAnswerStatusChanged(q['type']);
                });
        });

        answerChangedNotifier.initializeStatus(q['type']);
    }

    function _handleSelect(e) {
        if (isSolutionMode) return;

        var sel = $(this);
        if (!e.data['allowMulti']) {
            sel.siblings().removeClass('selected');
        }
        sel.toggleClass('selected');
        answerChangedNotifier.notifyIfAnswerStatusChanged(e.data['allowMulti'] ? 'MultipleChoiceQuestion' : 'MultiSelectQuestion');

        var answerId = $(this).attr('data-ans-id');
        var questionId = $(this).parent('ul').attr('data-question-id');

        // For event id : 1701210
        if(sel.hasClass('selected')) {
            qp.notifyOptionSelected(questionId, answerId);
        }
    }

    function _renderOptions(sel, q) {
        if ($.inArray(q['type'], ['MultiSelectQuestion', 'MultipleChoiceQuestion']) < 0) return;

        var c = $(sel),
            isMulti = (q['type'] === 'MultiSelectQuestion'),
            ul = $('ul', c).empty().attr('data-question-id', q['id']),
            firstCorrectFound = false;
        if(q['isStyleCustomized']) {
          c.addClass('custom-opts-container')
        }
        $.each(q['answers'] || [], function(idx, opt) {
            var isSel = opt['is_selected'],
                isCorrect = opt['is_correct'],
                cls = isSel ? 'selected' : '';

            if (isSolutionMode && isCorrect) {
                cls += ' opt-correct';
            }

            var answerIndex = (q['isStyleCustomized'])  ?  String.fromCharCode(97 + idx)+"." : String.fromCharCode(65 + idx)
            var li = $('#opt-item-template').children().clone()
                        .find('.idx').html(answerIndex).end()
                        .find('.ans')
                            .html(opt['title'])
                            .find('img')
                                .each(fixMiddleAlignForImage)
                            .end()
                        .end()
                        .attr('data-ans-id', opt['id']) //TODO: what if that is empty
                        .addClass(cls)
                        .click({allowMulti: isMulti}, _handleSelect)
                        .appendTo(ul);

            if (isSolutionMode && !firstCorrectFound && opt.is_correct && q['solution']) {
                if(!q.disableSolutionInOptions) {
                    $('#opt-solution-template').children().clone()
                        .find('.sol-text')
                            .html(q['solution'])
                            .find('img')
                                .each(fixMiddleAlignForImage)
                            .end()
                            .find('.mjx-chtml')
                                .each(scrollMathJax)
                            .end()
                        .end()
                        .appendTo(li);
                }

                    if (q['videoSolutionId']) {
                        $('.video-solution-wrapper',li)
                            .find('img.video-thumbnail')
                                .attr('src', q['videoSolutionThumbnailUrl'])
                                .error(function() {

                                    $(this).attr('src', 'i_c_default_thumbnail.png');

                                    /*var self = $(this);
                                    var p = self.parents('.video-solution-wrapper');
                                    var width = p.width() / 1.5;
                                    p.attr('height', width);
                                    self.attr('height', width);
                                    self.attr('src', '');*/
                                })
                            .end()

                        .click(function() {
                            qp.videoSolutionLinkClicked(q['videoSolutionId']);
                        })
                        .show();

                        var videoIconSrc = "ic_play.png";
                        if(q['isSolutionVideoLocked']) {
                            videoIconSrc = "ic_locked.png";
                        }

                        $('.video-solution-wrapper',li)
                            .find('img#img_icon')
                                .attr('src', videoIconSrc)
                            .end()

                        .click(function() {
                            //qp.videoSolutionLinkClicked(q['videoSolutionId']);
                        })
                        .show();
                    }

                firstCorrectFound = true;
            }

        });

        answerChangedNotifier.initializeStatus(q['type']);

        c.show();
    }

    function _getCorrectAnswers(q) {
        var ans = '',
            answers = q['answers'];
        if (typeof answers === 'undefined') return ans;

        switch (q['type']) {
            case 'FillInTheBlankQuestion':
                ans = $.map(answers, function(a) {
                    return a['correct_answer'];
                }).join(',  ');
                break;
            case 'MultiSelectQuestion':
            case 'MultipleChoiceQuestion':
                var c = -1;
                ans = $.map(answers, function(a) {
                    c++;
                    return a['is_correct'] ? String.fromCharCode(65 + c) : undefined;
                }).join(', ');
            default:
                break;
        }

        return ans;
    }

    function _allAnsCorrect(q) {
        var answers = q['answers'] || [];
        if (typeof answers === 'undefined') {
            return false;
        }
        switch (q['type']) {
            case 'FillInTheBlankQuestion':
                return $.map(answers, function(a) {
                    return a.is_correct || undefined;
                }).length == answers.length;
            break;
            case 'MultiSelectQuestion':
            case 'MultipleChoiceQuestion':
                return $.map(answers, function(a) {
                    return (a.is_correct == a.is_selected) || undefined;
                }).length == answers.length;
            default:
            break;
        }
        return false;
    }

    function _getUserAnswers(q) {
        var ans = '',
            answers = q['answers'];
        if (typeof answers === 'undefined') return ans;

        switch (q['type']) {
            case 'FillInTheBlankQuestion':
                ans = $.map(answers, function(a) {
                    return a['user_answer'];
                }).join(', ');
                break;
            case 'MultiSelectQuestion':
            case 'MultipleChoiceQuestion':
                var c = -1;
                ans = $.map(answers, function(a) {
                    c++;
                    return a['is_selected'] ? String.fromCharCode(65 + c) : undefined;
                }).join(', ');
            default:
                break;
        }

        return ans;
    }

    function _renderSolutionAlt(sel, q) {
        if (!isSolutionMode) return;
        var c = $(sel);

        var yourAnswer = _getUserAnswers(q);
        var correctAns  = _getCorrectAnswers(q);
        var allCorrect = _allAnsCorrect(q);

        // show only if attempted, either there is a mistake and its not filler. no point in showing
        // your answer when it is same as correct
        if (yourAnswer && (!allCorrect && q['type'] != 'FillInTheBlankQuestion')) {
            $('.solution-ans', c)
                .find('.sol-text')
                    .html(yourAnswer)
                    .end()
                .addClass('incorrect')
                .show();
        } else {
            $('.solution-ans', c).hide();
        }

        // show only if its non-filler or for a filler answer is wrong. fillers anyways will show the
        // answers
        if (!allCorrect || q['type'] != 'FillInTheBlankQuestion') {
            $('.solution-text', c)
                .find('.sol-text')
                    .html(correctAns)
                    .end()
                .show();
        } else {
            $('.solution-text', c).hide()
        }

        if (correctAns || yourAnswer) {
            c.show(); // only if one of the above.
        }
    }

    function _renderSolution(sel, q) {
        if (!isSolutionMode && !isSubjectiveQuestion) return;
        var c = $(sel);

        if (q['type'] == 'FillInTheBlankQuestion') {
            var solAns = $('.solution-ans', c),
                needToShow = false;;
            if (!_allAnsCorrect(q)) {
                solAns
                    .find('.sol-text')
                        .html(_getCorrectAnswers(q))
                        .end()
                    .show();
                needToShow = true;
            } else {
                solAns.hide();
            }
        }

        if (q['type'] == 'FillInTheBlankQuestion' || isSubjectiveQuestion) {
            var solText = $('.solution-text', c)
            if (typeof q['solution'] !== 'undefined') {
                solText
                    .find('.sol-text')
                        .html(q['solution'])
                            .find('.mjx-chtml')
                                .each(scrollMathJax)
                            .end()
                        .end()
                    .show();

                //Filler question video solution
                if (q['videoSolutionId']) {
                    var li = $('#opt-solution-template').children().clone()
                             .insertAfter(solText);

                    $('.solution-text',li).hide();

                    $('.video-solution-wrapper',li)
                        .find('img.video-thumbnail')
                            .attr('src', q['videoSolutionThumbnailUrl'])
                            .error(function() {

                                $(this).attr('src', 'i_c_default_thumbnail.png');
                                /*var self = $(this);
                                var p = self.parents('.video-solution-wrapper');
                                var width = p.width() / 1.5;
                                p.attr('height', width);
                                self.attr('height', width);
                                self.attr('src', '');
                                self.parents('div.sol-container.opt-sol-container').css('width', '100%');*/
                            })
                        .end()

                    .click(function() {
                        qp.videoSolutionLinkClicked(q['videoSolutionId']);
                    })
                    .show();

                    var videoIconSrc = "ic_play.png";
                    if(q['isSolutionVideoLocked']) {
                        videoIconSrc = "ic_locked.png";
                    }

                    $('.video-solution-wrapper',li)
                        .find('img#img_icon')
                            .attr('src', videoIconSrc)
                        .end()

                    .click(function() {
                        //qp.videoSolutionLinkClicked(q['videoSolutionId']);
                    })
                    .show();
                }

                if (isSubjectiveQuestion) {
                    solText.hide();
                    $('.solution-text-toggle-btn').click(function() {
                        c.toggleClass('expanded');
                        solText.toggle();
                    });
                    $('.solution-text-toggle-btn').on('click.report_toggle_solution',function() {
                        qp.notifySubjectiveSolutionView(c.hasClass('expanded'));
                        $('.solution-text-toggle-btn').off('click.report_toggle_solution');
                    });
                }
                needToShow = true;
            } else {
                solText.hide();
            }

        }

        if (needToShow) {
            c.show();
        }

    }

    function _getMCQData(c) {
        return $.map($('li.selected', $(c)), function(elem){
            return $(elem).attr('data-ans-id')
        });
    }

    function _getFillerData(c) {
        return $.map($('tnl-filler input'), function(elem) {
            return $(elem).val();
        });
    }

    function _renderSkills(sel, q) {
        var skills = q['skills'];
        if (!$.isArray(skills) || skills.length == 0) return;

        var skillStrings = $.map(skills, function(v) {
            return '<div class="q-skill"><div class="q-skill-text">' + v + '</div></div>';
        });

        $(sel).hide().html(skillStrings).show();
    }

    var qCls = {
        'MultiSelectQuestion': ' tnl-mcq tnl-multi',
        'MultipleChoiceQuestion': ' tnl-mcq tnl-single',
        'FillInTheBlankQuestion': ' tnl-filler',
        'EssayQuestion': ' tnl-essay'
    };
    function _getQuestionClasses(q) {
        var cls = isQuestionMode ? 'question-mode' : 'solution-mode';
        cls += qCls[q['type']] || '';
        return cls;
    }

    return {
        renderQuestion: _renderQuestion,
        getMCQData: _getMCQData,
        getFillerData: _getFillerData,
        getQuestionClasses: _getQuestionClasses
    };
})();

/* global variables */
var isQuestionMode = false;
var isSolutionMode = false;
var isHintsMode = false;
var isSubjectiveQuestion = false;
var needsScrollPadding = false;

jQuery.fn.extend({
    /**
    * Returns get parameters.
    *
    * If the desired param does not exist, null will be returned
    *
    * To get the document params:
    * @example value = $(document).getUrlParam("paramName");
    *
    * To get the params of a html-attribut (uses src attribute)
    * @example value = $('#imgLink').getUrlParam("paramName");
    */
    getUrlParam: function(strParamName){
        strParamName = escape(unescape(strParamName));

        var returnVal = new Array();
        var qString = null;

        if ($(this).attr('nodeName')=='#document') {
          //document-handler

        if (window.location.search.search(strParamName) > -1 ){

          qString = window.location.search.substr(1,window.location.search.length).split('&');
        }

        } else if ($(this).attr('src')!='undefined') {

          var strHref = $(this).attr('src')
          if ( strHref.indexOf('?') > -1 ){
            var strQueryString = strHref.substr(strHref.indexOf('?')+1);
            qString = strQueryString.split('&');
          }
        } else if ($(this).attr('href')!='undefined') {

          var strHref = $(this).attr('href')
          if ( strHref.indexOf('?') > -1 ){
            var strQueryString = strHref.substr(strHref.indexOf('?')+1);
            qString = strQueryString.split('&');
          }
        } else {
          return null;
        }


        if (qString==null) return null;


        for (var i=0;i<qString.length; i++){
          if (escape(unescape(qString[i].split('=')[0])) == strParamName){
            returnVal.push(qString[i].split('=')[1]);
          }

        }


        if (returnVal.length==0) return null;
        else if (returnVal.length==1) return returnVal[0];
        else return returnVal;
    }
});



var ENV_ANDROID = 0, ENV_IOS = 1, ENV_OTHER = 2;

var execEnv = (function() {
    var standalone = window.navigator.standalone,
        userAgent = window.navigator.userAgent.toLowerCase(),
        safari = /safari/.test( userAgent ),
        ios = /iphone|ipod|ipad/.test( userAgent );
    if (ios && !standalone && !safari) {
        return ENV_IOS;
    } else if (typeof tnl_app !== 'undefined') {
        return ENV_ANDROID;
    }
    return ENV_OTHER;
})();

function fatalError(message) {
    $(document).ready(function() {
        $('body').prepend('<div style="color: red; font-size: large;">' + message + '</div>');
    })
    console.log(message);
    throw new Error('something');
}
