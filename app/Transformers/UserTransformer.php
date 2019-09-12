<?php
namespace App\Transformers;
use App\User;
use League\Fractal\TransformerAbstract;
class UserTransformer extends TransformerAbstract
{

    /**
     * List of resources possible to include
     *
     * @var array
     */   protected $availableIncludes = [
        'posts','comments','tags'
    ];

     /**
     * A Fractal transformer.
     *
     * @return array
     */
    public function transform(User $api)
    {
        return [
            'id'      => (int) $api->id,
            'user_id'   =>(int)  $api->user_id,
            'title'    => $api->title,
            'status'    => $api->status,
            'body'    => $api->body,
            'published`_on'    => $api->published_on,
            'created_at'    => $api->created_at,
            'updated_at'    => $api->updated_at,
        ];
    }

    /**
     * Include Post Author
     *
     * @return \League\Fractal\Resource\Item
     */
    public function includePostAuthor(User $user)
    {
        $author = $user->postAuthor;

        return $this->item($author, new AuthorTransformer);
    }
    /**
     * Include Post Tags
     *
     * @return \League\Fractal\Resource\Collection
     */
    public function includeTags(Post $post)
    {
        $tags = $post->tags;

        return $this->collection($tags, new TagTransformer);
    }
}
