if (execEnv != ENV_ANDROID || typeof already_included_env !== 'undefined') {
    fatalError('You have android version enabled, however you are not on android or have multiple env enabled');
}
already_included_env = true;

function getMCQData(questionID, callback) {
    callback.apply(tnl_app, [questionID, JSON.stringify(_getMCQData())]);
}

function getFillerData(questionID, callback) {
    callback.apply(tnl_app, [questionID, JSON.stringify(_getFillerData())]);
}

function initSolutions(questionIDs) {
    _initSolutions(JSON.parse(questionIDs));
}

function renderEvaluatedResult(questionID, showSolutionText) {
    qp.getQuestionData(questionID, function(questionData) {
        _renderEvaluatedResult(questionData, showSolutionText);
    });
}

function resetAndRenderQuestion(questionID) {
    qp.getQuestionData(questionID, function(questionData) {
        _resetAndRenderQuestion(questionData);
    });
}

var questionProvider = qp = (function () {
    return {
        getQuestionData: function(questionID, callback) {
            try {
                callback(JSON.parse(tnl_app.getQuestionData(parseInt(questionID))));
            } catch(e) {
                console.log(e);
            }
        },

        imageClicked: function(src, zoomLevel) {
            try {
                tnl_app.imageClicked(src, zoomLevel * (window['devicePixelRatio'] || 1));
            } catch(e) {
                console.log(e);
            }
        },

        solutionClicked: function(questionID) {
            try {
                tnl_app.solutionClicked(parseInt(questionID));
            } catch(e) {
                console.log(e);
            }
        },

        scrollQuestionCard: function(distance) {
            try {
            	tnl_app.scrollQuestionCard((window['devicePixelRatio'] || 1) * distance);
            } catch(e) {
                console.log(e);
            }
        },

        notifyAnswerStatusChanged: function(newStatus) {
            try {
                if (typeof tnl_app.notifyAnswerStatusChanged != 'undefined') {
                    tnl_app.notifyAnswerStatusChanged(newStatus);
                }
            } catch(e) {}
        },

        notifySubjectiveSolutionView: function(newStatus) {
            try {
                if (typeof tnl_app.notifySubjectiveSolutionView != 'undefined') {
                    tnl_app.notifySubjectiveSolutionView(newStatus);
                }
            } catch(e) {}
        },

        videoSolutionLinkClicked: function(resourceId) {
            try {
                if (typeof tnl_app.videoSolutionLinkClicked != 'undefined') {
                    tnl_app.videoSolutionLinkClicked(resourceId);
                }
            } catch(e) {
                console.log("error playing video");
            }
        },

        notifyOptionSelected: function(questionId, answerId) {
            try {
                if (typeof tnl_app.notifyOptionSelected != 'undefined') {
                    tnl_app.notifyOptionSelected(questionId, answerId);
                }
            } catch(e) {
                console.log("error playing video");
            }
        },

        getHintsData: function(callback) {
            try {
                var hintsObj = JSON.parse(tnl_app.getHintsData());
                callback(hintsObj['hint_title'], hintsObj['hint_text']);
            } catch(e) {
                console.log(e);
            }
        }
    }
})();
