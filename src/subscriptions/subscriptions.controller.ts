import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from '../plans/domain/subscription';
import { User } from '../users/domain/user';
import { UserType } from '../users/domain/enums/user-type.enum'; // For role check
import { RolesGuard } from '../roles/roles.guard'; // Assuming RolesGuard can check UserType
import { Roles } from '../roles/roles.decorator';     // Assuming Roles decorator can check UserType

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) // General JWT Guard
  @ApiBearerAuth()
  // Add specific role/userType guard if needed, e.g. only WORKER can subscribe
  // @Roles(UserType.WORKER) - This would require RolesGuard to handle UserType
  @ApiCreatedResponse({ type: Subscription })
  async subscribe(@Body() createSubscriptionDto: CreateSubscriptionDto, @Req() request: { user: User }): Promise<Subscription> {
    if (request.user.userType !== UserType.WORKER) {
        throw new ForbiddenException('Only workers can subscribe to plans.');
    }
    return this.subscriptionsService.create(createSubscriptionDto, request.user);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({ type: Subscription })
  async getMySubscription(@Req() request: { user: User }): Promise<Subscription | null> {
    if (request.user.userType !== UserType.WORKER) {
        throw new ForbiddenException('Only workers can have subscriptions.');
    }
    const subscription = await this.subscriptionsService.findByWorker(request.user.id);
    if (!subscription) {
        throw new NotFoundException('No active subscription found for this worker.');
    }
    return subscription;
  }

  @Delete('/:id/cancel')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({ type: Subscription })
  cancelMySubscription(@Param('id', ParseIntPipe) id: number, @Req() request: { user: User }): Promise<Subscription> {
     if (request.user.userType !== UserType.WORKER) {
        throw new ForbiddenException('Only workers can cancel subscriptions.');
    }
    return this.subscriptionsService.cancelSubscription(id, request.user);
  }

  // Stripe Webhook Endpoint (Basic Structure)
  // This endpoint should NOT use JWT AuthGuard, as it's called by an external service (Stripe)
  // Security is handled by verifying Stripe's signature (complex, not implemented here)
  @Post('/webhook/stripe')
  @HttpCode(HttpStatus.OK) // Stripe expects a 200 OK response
  @ApiOkResponse({ description: 'Stripe webhook received' })
  async handleStripeWebhook(@Body() rawBody: any, @Req() req: any) { // Renamed request to req to avoid conflict
    const sig = req.headers['stripe-signature'];
    // In a real app, verify signature and use a raw body parser for Stripe
    // For this subtask, we assume the body is parsed and simulate metadata access
    // This is highly simplified and not production-ready for webhooks.
    if (rawBody.type === 'payment_intent.succeeded') {
      const paymentIntent = rawBody.data.object;
      // Assuming metadata is directly available or part of a known structure
      await this.subscriptionsService.handlePaymentSuccess(paymentIntent.id, paymentIntent.metadata || {});
      console.log('Simulated handling of payment_intent.succeeded');
    } else {
      console.log('Received Stripe webhook event type:', rawBody.type);
    }
    return { received: true };
  }
}
