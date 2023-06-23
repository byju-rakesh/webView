import 'package:flutter/material.dart';
import 'package:test_js_wrapper/ui/widgets/test_js_wrapper.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'WebView',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home:TestJsWrapper(mode: 'question', downloadFilePath: '', videoThumbnailBaseUrl: '', defaultQuestionId: 122638, subjectName: 'History', assessmentId: '', isStyleCustomized: true, isInAdaptiveFlow: true, isTopPaddingRequired: true, isExtraBottomSpaceRequired: true, disableSolutionInOptions: true)
    );
  }
}
