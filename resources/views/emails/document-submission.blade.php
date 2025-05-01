@component('mail::message')
# Hello

We’ve received your submission titled "**{{ $document->title }}**" and it is now being processed by the our team.

@component('mail::button', ['url' => $url])
Track Progress
@endcomponent

Alternatively, you can scan the QR code below to track the progress of your submission:

![Scan to track]({{ $qrCodeUrl }})

Thank you,  
{{ config('app.name') }}
@endcomponent
