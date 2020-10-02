%% Input format from Vision
%% detectedObjState(<videoID>, <objLabel>, <stateLabel>, <"before"/"after">).
%% detectedAction(<videoID>, <actionLabel>, <objLabel> [optional]).

%E.g.,
%detectedObjState(1,knife, placedOnTable, before).
%detectedAction(1, pickUp, knife).
%detectedObjState(1,knife, carring, after).

% Note 1: actions are written in present perfect, states in past perfect or in gerund (-ing).
% Note 2: Only specify what is being detected during training, not what is not being detected
% Note 3: Add only what has been learned, i.e., after processing the dataset, filtering out data with low confidence etc
% Note 4: Use the object category (class label), e.g., knife, DO NOT use the object id, e.g., knife1.
% Note 4: No empty spaces, no underscore, between words, e.g., "pickingUp", instead of "picking Up"


detectedObjState(2,bottle, closed, before).
detectedAction(2, open, bottle).
detectedObjState(2,bottle, opened, after).

detectedObjState(3,bottle, opened, before).
detectedAction(3, close, bottle).
detectedObjState(3,bottle, closed, after).

detectedObjState(4,book, closed, before).
detectedAction(4, open, book).
detectedObjState(4,book, opened, after).

detectedObjState(5,book, opened, before).
detectedAction(5, close, book).
detectedObjState(5,book, closed, after).


% bottle
detectedObjState(6,bottle, unfilled, before).
detectedAction(6, put, bottle).
detectedObjState(6,bottle, filled, after).

detectedObjState(7,bottle, unfilled, before).
detectedAction(7, pour, bottle).
detectedObjState(7,bottle, filled, after).

detectedObjState(8,bottle, unfilled, before).
detectedAction(8, spill, bottle).
detectedObjState(8,bottle, filled, after).

detectedObjState(9,bottle, filled, before).
detectedAction(9, pour, bottle).
detectedObjState(9,bottle, unfilled, after).

detectedObjState(10,bottle, filled, before).
detectedAction(10, take, bottle).
detectedObjState(10,bottle, unfilled, after).

% glass
detectedObjState(11,glass, unfilled, before).
detectedAction(11, put, glass).
detectedObjState(11,glass, filled, after).

detectedObjState(12,glass, unfilled, before).
detectedAction(12, pour, glass).
detectedObjState(12,glass, filled, after).

detectedObjState(13,glass, unfilled, before).
detectedAction(13, spill, glass).
detectedObjState(13,glass, filled, after).

detectedObjState(14,glass, filled, before).
detectedAction(14, pour, glass).
detectedObjState(14,glass, unfilled, after).

detectedObjState(15,glass, filled, before).
detectedAction(15, take, glass).
detectedObjState(15,glass, unfilled, after).

% cup
detectedObjState(16,cup, unfilled, before).
detectedAction(16, put, cup).
detectedObjState(16,cup, filled, after).

detectedObjState(16,cup, unfilled, before).
detectedAction(16, pour, cup).
detectedObjState(16,cup, filled, after).

detectedObjState(17,cup, unfilled, before).
detectedAction(17, spill, cup).
detectedObjState(17,cup, filled, after).

detectedObjState(18,cup, filled, before).
detectedAction(18, pour, cup).
detectedObjState(18,cup, unfilled, after).

detectedObjState(19,cup, filled, before).
detectedAction(19, take, cup).
detectedObjState(19,cup, unfilled, after).

% mug
detectedObjState(20,mug, unfilled, before).
detectedAction(20, put, mug).
detectedObjState(20,mug, filled, after).

detectedObjState(21,mug, unfilled, before).
detectedAction(21, pour, mug).
detectedObjState(21,mug, filled, after).

detectedObjState(22,mug, unfilled, before).
detectedAction(22, spill, mug).
detectedObjState(22,mug, filled, after).

detectedObjState(23,mug, filled, before).
detectedAction(23, pour, mug).
detectedObjState(23,mug, unfilled, after).

detectedObjState(24,mug, filled, before).
detectedAction(24, take, mug).
detectedObjState(24,mug, unfilled, after).




%container
detectedObjState(25,container, empty, before).
detectedAction(25, put, container).
detectedObjState(25,container, occupied, after).

detectedObjState(26,container, empty, before).
detectedAction(26, stuff, container).
detectedObjState(26,container, occupied, after).

detectedObjState(27,container, occupied, before).
detectedAction(27, take, container).
detectedObjState(27,container, empty, after).


%box
detectedObjState(28,box, empty, before).
detectedAction(28, put, box).
detectedObjState(28,box, occupied, after).

detectedObjState(29,box, empty, before).
detectedAction(29, stuff, box).
detectedObjState(29,box, occupied, after).

detectedObjState(30,box, occupied, before).
detectedAction(30, take, box).
detectedObjState(30,box, empty, after).



%phone
detectedObjState(31,phone, unconnected, before).
detectedAction(31, plug, phone).
detectedObjState(31,phone, connected, after).

detectedObjState(32,phone, unconnected, before).
detectedAction(32, pull, phone).
detectedObjState(32,phone, connected, after).

detectedObjState(33,phone, unconnected, before).
detectedAction(33, attach, phone).
detectedObjState(33,phone, connected, after).

detectedObjState(34,phone, connected, before).
detectedAction(34, pull, phone).
detectedObjState(34,phone, unconnected, after).

detectedObjState(35,phone, connected, before).
detectedAction(35, take, phone).
detectedObjState(35,phone, unconnected, after).



%charger
detectedObjState(36,charger, unconnected, before).
detectedAction(36, plug, charger).
detectedObjState(36,charger, connected, after).

detectedObjState(37,charger, unconnected, before).
detectedAction(37, pull, charger).
detectedObjState(37,charger, connected, after).

detectedObjState(38,charger, unconnected, before).
detectedAction(38, attach, charger).
detectedObjState(38,charger, connected, after).

detectedObjState(39,charger, connected, before).
detectedAction(39, pull, charger).
detectedObjState(39,charger, unconnected, after).

detectedObjState(40,charger, connected, before).
detectedAction(40, take, charger).
detectedObjState(40,charger, unconnected, after).
