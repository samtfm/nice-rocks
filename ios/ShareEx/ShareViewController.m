//
//  ShareViewController.m
//  ShareEx
//
//  Created by Sam Faber-Manning on 9/16/20.
//

#import "ShareViewController.h"
#import <MobileCoreServices/MobileCoreServices.h>

#define URL_IDENTIFIER (NSString *)kUTTypeURL


@interface ShareViewController ()

@end

@implementation ShareViewController

- (BOOL)isContentValid {
    // Do validation of contentText and/or NSExtensionContext attachments here
    return YES;
}

- ( void ) didSelectPost
{
    [ self passSelectedItemsToApp ];

    // Note: This call is expected to be made here. Ignore it. We'll tell the host we are done after we've invoked the app.
    //    [ self.extensionContext completeRequestReturningItems: @[] completionHandler: nil ];
}

//- (NSString *)urlencode {
//    NSMutableString *output = [NSMutableString string];
//    const unsigned char *source = (const unsigned char *)[self NSString];
//    int sourceLen = strlen((const char *)source);
//    for (int i = 0; i < sourceLen; ++i) {
//        const unsigned char thisChar = source[i];
//        if (thisChar == ' '){
//            [output appendString:@"+"];
//        } else if (thisChar == '.' || thisChar == '-' || thisChar == '_' || thisChar == '~' ||
//                   (thisChar >= 'a' && thisChar <= 'z') ||
//                   (thisChar >= 'A' && thisChar <= 'Z') ||
//                   (thisChar >= '0' && thisChar <= '9')) {
//            [output appendFormat:@"%c", thisChar];
//        } else {
//            [output appendFormat:@"%%%02X", thisChar];
//        }
//    }
//    return output;
//}


- ( void ) passSelectedItemsToApp {
    NSExtensionItem * item = self.extensionContext.inputItems.firstObject;
    __block NSItemProvider *provider = item.attachments.firstObject;
  
    if([provider hasItemConformingToTypeIdentifier:URL_IDENTIFIER]) {
      [provider loadItemForTypeIdentifier:URL_IDENTIFIER options:nil completionHandler:^(id<NSSecureCoding> item, NSError *error) {
        NSURL *url = (NSURL *)item;
        NSDictionary *result = @{@"data": [url absoluteString], @"type": @"url"};
        
      
        NSString * urlString = [url absoluteString];  // A string to be passed to your AIR app with information about the attachments.
//        NSString* encodedUrl = [urlString stringByAddingPercentEscapesUsingEncoding: NSUTF8StringEncoding];
//        NSString* encodedUrl = [urlString stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLUserAllowedCharacterSet]];
        NSString* encodedUrl = [[[urlString stringByAddingPercentEscapesUsingEncoding:NSASCIIStringEncoding] stringByReplacingOccurrencesOfString:@"&" withString:@"%26"] stringByReplacingOccurrencesOfString:@"+" withString:@"%2b"];

        NSString * m_invokeArgs = [ NSString stringWithFormat: @"?shareUrl=%@", encodedUrl ];

        [ self invokeApp: m_invokeArgs ];
      }];
      
      return;
    }
}

- ( void ) invokeApp: ( NSString * ) invokeArgs {
    // Prepare the URL request
    NSString * urlString = [ NSString stringWithFormat: @"nicerocks://%@", ( NULL == invokeArgs ? @"" : invokeArgs ) ];
    NSURL * url = [ NSURL URLWithString: urlString ];

    NSString *className = @"UIApplication";
    if ( NSClassFromString( className ) )
    {
        id object = [ NSClassFromString( className ) performSelector: @selector( sharedApplication ) ];
      
        [ object performSelector: @selector( openURL: ) withObject: url ];
    }

    // Now let the host app know we are done, so that it unblocks its UI:
    [ super didSelectPost ];
}

- (NSArray *)configurationItems {
    // To add configuration options via table cells at the bottom of the sheet, return an array of SLComposeSheetConfigurationItem here.
    return @[];
}

@end
