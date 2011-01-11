/// Copyright (C) 2010 Dylon Edwards
///
/// This code is available under MIT License.
/// 
/// Permission is hereby granted, free of charge, to any person obtaining a copy
/// of this software and associated documentation files (the "Software"), to deal
/// in the Software without restriction, including without limitation the rights
/// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
/// copies of the Software, and to permit persons to whom the Software is
/// furnished to do so, subject to the following conditions:
/// 
/// The above copyright notice and this permission notice shall be included in
/// all copies or substantial portions of the Software.
/// 
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.

using System;

namespace DllBest.Avl {

	public interface ITree<T,N> : DllBest.IUnique<T,N>, DllBest.IRedundant<T,N>
		where N : INode<T,N> {

		void RRC(ref N A, out N B, out N C, ref N F);
		
		void RLC(ref N A, out N B, out N C, ref N F);
		
		void LLC(ref N A, out N B, out N C, ref N F);

		void LRC(ref N A, out N B, out N C, ref N F);

		/// <summary>
		/// Rebalances a given Node.  To see every case in which a Node will
		/// need to be balanced, see:
		///
		/// <see cref="http://www.cse.ohio-state.edu/~sgomori/570/avlrotations.html" />
		/// </summary>
		///
		/// <param name="node">
		/// Node to rebalance </param>
		void Rebalance(N node);

		/// <summary>
		/// Recomputes the heights of all the nodes from the current one to the
		/// root </summary>
		///
		/// <param name="node">
		/// The Node whose height is to be recomputed </param>
		void RecomputeHeights(N node);

		void AddLeft(N parent, N child, ref N candidate);

		void AddRight(N parent, N child, ref N candidate);

		/// <summary>
		/// Adds the child Node as an equal pointer to an equivalent Node
		/// already in this Tree </summary>
		///
		/// <param name="parent"> Parent Node </param>
		/// <param name="child"> Child Node </param>
		void AddEqual(N parent, N child);

		/// <summary>
		/// Removes a leaf Node from this Tree </summary>
		///
		/// <param name="node">
		/// The Node to remove </param>
		void RemoveLeaf(N node);

		/// <summary>
		/// Removes a branch Node from this Tree </summary>
		///
		/// <param name="node">
		/// The Node to remove </param>
		void RemoveBranch(N node);

		/// <summary>
		/// Removes a Node from this Tree that has two children </summary>
		///
		/// <param name="node">
		/// The Node to remove </param>
		void SwapAndRemove(N node);

		/// <summary>
		/// Swaps the values of two Nodes in this Tree </summary>
		///
		/// <param name="node1">
		/// Node to swap with node2 </param>
		///
		/// <param name="node2">
		/// Node to swap with node1 </param>
		void SwapNodes(N node1, N node2);
	}
}

