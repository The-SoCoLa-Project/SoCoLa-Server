@Vision
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
Add all axioms from training in "visionInput.lp", following the format given, e.g.:
%% Input format from Vision
%% detectedObjState(<videoID>, <objLabel>, <stateLabel>, <"before"/"after">).
%% detectedAction(<videoID>, <actionLabel>, <objLabel> [optional]).
%% Example:
detectedObjState(1,knife, placedOnTable, before).
detectedAction(1, pickUp, knife).
detectedObjState(1,knife, carring, after).

% Note 1: actions are written in present perfect, states in past perfect or in gerund (-ing).
% Note 2: Only specify what is being detected during training, not what is not being detected
% Note 3: Add only what has been learned, i.e., after processing the dataset, filtering out data with low confidence etc
% Note 4: Use the object category (class label), e.g., knife, DO NOT use the object id, e.g., knife1.
% Note 4: No empty spaces, no underscore, between words, e.g., "pickingUp", instead of "picking Up"

This happens only once, at training time, not at run-time



@UI
Step 1. Write the json message received from Vision in the file "jsonIncomingMessage.txt"

Step 2. Make sure the json message also contains the entries 
"Scenario": 2, "Step" : 2,
BEFORE the message tag

Step 3. Run the jar

Step 4. Show in GUI the content of the file reasonerOutput.txt

That's all!


