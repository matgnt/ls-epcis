# Impelementation Status

## EPCIS Version 1.1 Specification (May 2014)

**R**equired or **O**ptional
  
Fields              | ObjectEvent  | AggregationEvent | TransactionEvent | TransformationEvent
--------------------|--------------|------------------|------------------|---------------------
eventTime           | R            | R                | R                | R
recordTime          | O            | O                | O                | O
eventTimeZoneOffset | R            | R                | R                | R
sourceList          | O            | O                | O                | O
destinationList     | O            | O                | O                | O
bizStep             | O            | O                | O                | O
disposition         | O            | O                | O                | O
readPoint           | O            | O                | O                | O
bizLocation         | O            | O                | O                | O
bizTransactionList  | O            | O                | R                | O
action              | R            | R                | R                |
epcList             | O            |                  | O                |
quantityList        | O            |                  | O                |
childQuantityList   |              | O                |                  |
parentID            |              | O                | O                |
childEPCs           |              | O                |                  |
ilmd                | O            |                  |                  | O
inputEPCList        |              |                  |                  | O
outputEPCList       |              |                  |                  | O
inputQuantityList   |              |                  |                  | O
outputQuantityList  |              |                  |                  | O
transformationID    |              |                  |                  | O
 
 
## Different meanings of an "Action"
TODO
 
## Notes
* *epcList*: If multiple items are listet, the event is valid for all of them. Thus, it can be split into individual events too.
* If *bizTransactionList* is given, it maps to the objects identified in *epcList* and *quantityList*. This means we could still create individual events here. Right?
 
 
## General
 
_       | Retrospective ( at the time of the event) | Prospective (true until contradicted by subsequent event) |
--------|-------------------------------------------|-----------------------------------------------------------|
What    | *EPC*, *EPCClass* + quantity
When    | *Time*                                    |
Where   | *ReadPointID*                             | *BusinessLocationID*
Why     | *BusinessStepID*                          | *DispositionID*
        | *BusinessTransactionList, Source/Destination, ILMD*


