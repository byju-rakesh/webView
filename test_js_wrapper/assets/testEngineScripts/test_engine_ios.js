if (execEnv != ENV_IOS || typeof already_included_env !== 'undefined') {
    fatalError('You have ios version enabled, however you are not on ios or have multiple env enabled');
}
already_included_env = true;

var questionProvider = qp = (function () {

    function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 2)
    }

    setupWebViewJavascriptBridge(function(bridge) {
         bridge.registerHandler('getMCQData', function(questionID, responseCallback) {
            responseCallback({
                questionID: questionID,
                selected: _getMCQData()
            });
         });

         bridge.registerHandler('getFillerData', function(questionID, responseCallback) {
            responseCallback({
                questionID: questionID,
                filled: _getFillerData()
            });
         });

         bridge.registerHandler('renderEvaluatedResult', function(data) {
            _renderEvaluatedResult(data['questionData'], data['showSolutionText']);
         });

        bridge.registerHandler('resetAndRenderQuestion', function(data) {
            _resetAndRenderQuestion(data['questionData']);
        });
    });

    return {
        imageClicked: function(src, zoomLevel) {
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('imageClicked', { 'src': src, 'zoom': zoomLevel });
            });
        },

        solutionClicked: function(questionID) {
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('solutionClicked', { 'questionID': questionID });
            });
        },

        getQuestionData: function(questionID, callback) {
            setupWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('getQuestionData', { 'questionID': questionID }, callback);
            });
        },

        scrollQuestionCard: function(distance) {
            $(document).scrollTop(distance);
        },

        notifyAnswerStatusChanged: function(newStatus) {
            try {
                setupWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('notifyAnswerStatusChanged', { 'newStatus': newStatus});
                });
            } catch(e) {}
        },

        notifySubjectiveSolutionView: function(newStatus) {
            try {
                setupWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('notifySubjectiveSolutionView', { 'newStatus': newStatus});
                });
            } catch(e) {}
        },

        videoSolutionLinkClicked: function(resourceId) {
            try {
                setupWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('videoSolutionLinkClicked', { 'resourceId': resourceId});
                });
            } catch(e) {}
        },

        notifyOptionSelected: function(questionId, answerId) {
            try {
                setupWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('notifyOptionSelected', { 'questionId': questionId, 'answerId': answerId});
                });
            } catch(e) {}
        },

        getHintsData: function(callback) {
            try {
                setupWebViewJavascriptBridge(function(bridge) {
                    bridge.callHandler('getHintsData', function(hintsObj) {
                        callback(hintsObj['hint_title'], hintsObj['hint_text']);
                    });
                });
            } catch(e) {};
        }
    }
})();
